import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import emailjs from '@emailjs/browser';
import { Calendar } from "@/components/ui/calendar";
import { CustomPhoneInput } from "./PhoneInput";
import { isValidPhoneNumber } from 'react-phone-number-input';
import { format } from "date-fns";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { boatSizeCategories, type BoatSize } from "@/data/services";
import { MapPin, Anchor, Ship, Calendar as CalendarIcon, User, Mail, MessageSquare } from "lucide-react";

export interface TransferBookingData {
  type: 'transfer';
  date: Date;
  boatSize: BoatSize | "";
  origin: string;
  destination: string;
  name: string;
  email: string;
  phone: string;
  boatName: string;
  observations: string;
}

interface TransferBookingFormProps {
  setSubmitted?: (submitted: boolean) => void;
  onClose?: () => void;
  onSubmit?: (data: TransferBookingData) => void;
  isAdmin?: boolean;
}

export const TransferBookingForm = ({ setSubmitted, onClose, onSubmit, isAdmin }: TransferBookingFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [boatName, setBoatName] = useState("");
  const [boatSize, setBoatSize] = useState<BoatSize | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+351");
  const [observations, setObservations] = useState("");

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email.toLowerCase());
      const fetchProfile = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.name) setName(data.name);
            if (data.phone) setPhone(data.phone);
            if (data.boats && data.boats.length > 0) setBoatName(data.boats[0]);
            else if (data.boatName) setBoatName(data.boatName);
          }
        } catch (err) {
          console.error("Error fetching profile for pre-fill:", err);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!name || !email || !phone || !selectedDate || !origin || !destination || !boatSize) {
        toast({
          title: "Campos em falta",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
    }

    if (phone && phone.startsWith('+351')) {
      const digitsOnly = phone.replace(/\D/g, '');
      if (digitsOnly.length !== 12) {
        toast({ title: "Número Inválido", description: "O número deve ter 9 dígitos.", variant: "destructive" });
        return;
      }
    } else if (phone && !isValidPhoneNumber(phone)) {
        toast({ title: "Número Inválido", description: "Insira um número válido.", variant: "destructive" });
        return;
    }

    if (onSubmit) {
        onSubmit({
            type: 'transfer',
            date: selectedDate,
            boatSize,
            origin,
            destination,
            name,
            email,
            phone,
            boatName,
            observations
        });
        return;
    }

    setSubmitting(true);
    try {
      const cleanEmail = email.toLowerCase().trim();
      
      await addDoc(collection(db, 'bookings'), {
        type: 'transfer',
        date: format(selectedDate, "yyyy-MM-dd"),
        boat_size: boatSize,
        origin,
        destination,
        name,
        email: cleanEmail,
        phone,
        boat_name: boatName,
        observations,
        is_confirmed: false,
        created_at: new Date().toISOString()
      });

      // EmailJS Integration
      const templateParams = {
        user_name: name,
        user_email: email,
        user_phone: phone,
        date: format(selectedDate, "dd/MM/yyyy"),
        boat_name: boatName || "N/A",
        boat_size: boatSizeCategories.find(c => c.id === boatSize)?.label || boatSize || "N/A",
        origin,
        destination,
        service_type: "Transfer de Embarcação",
        observations: observations || "Nenhum"
      };

      try {
          await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            { ...templateParams, to_email: email },
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
          );
      } catch (emailErr) {
          console.error("EmailJS error:", emailErr);
      }

      if (setSubmitted) setSubmitted(true);
      toast({ title: "Pedido Enviado", description: "Entraremos em contacto brevemente com o seu orçamento." });
    } catch (err: any) {
      console.error("Error saving transfer booking:", err);
      toast({ title: "Erro", description: "Tente novamente.", variant: "destructive" });
    } finally {
        setSubmitting(false);
    }
  };

  const formItemVariant: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({ 
      y: 0, 
      opacity: 1, 
      transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" } 
    })
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-white p-6 md:p-10 rounded-[2.5rem] premium-shadow border border-gray-100"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* COLUMN 1: ROUTE & BOAT */}
      <div className="flex flex-col gap-6">
        <motion.div custom={0} variants={formItemVariant}>
            <div className="flex items-center gap-2 mb-4 text-primary">
                <MapPin className="w-5 h-5" />
                <h3 className="font-display font-bold uppercase tracking-widest text-sm">1. Rota e Barco</h3>
            </div>
            
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Localização Atual *</label>
                    <div className="relative">
                        <Anchor className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                        <input
                            type="text"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            required
                            placeholder="Onde está o barco?"
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-10 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Destino Pretendido *</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            required
                            placeholder="Para onde quer levar o barco?"
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-10 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Nome do Barco</label>
                    <div className="relative">
                        <Ship className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                        <input
                            type="text"
                            value={boatName}
                            onChange={(e) => setBoatName(e.target.value)}
                            placeholder="Ex: Sea Freedom"
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-10 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        />
                    </div>
                </div>
            </div>
        </motion.div>

        <motion.div custom={1} variants={formItemVariant}>
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block ml-1">Tamanho da Embarcação *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-3">
                {boatSizeCategories.map((size) => (
                    <button
                        key={size.id}
                        type="button"
                        onClick={() => setBoatSize(boatSize === size.id ? "" : size.id)}
                        className={`py-4 px-2 rounded-2xl border-2 text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center justify-center min-h-[60px] ${
                            boatSize === size.id 
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                            : "bg-white border-gray-100 text-gray-500 hover:border-primary/50"
                        }`}
                    >
                        {size.label}
                    </button>
                ))}
            </div>
        </motion.div>
      </div>

      {/* COLUMN 2: CONTACTS */}
      <div className="flex flex-col gap-6">
        <motion.div custom={2} variants={formItemVariant}>
            <div className="flex items-center gap-2 mb-4 text-primary">
                <User className="w-5 h-5" />
                <h3 className="font-display font-bold uppercase tracking-widest text-sm">2. Contactos</h3>
            </div>
            
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Nome Completo *</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="O seu nome"
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-10 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Email *</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="exemplo@email.com"
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-10 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Telemóvel *</label>
                    <CustomPhoneInput
                        value={phone}
                        onChange={setPhone}
                        className="bg-gray-50"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1">Observações Adicionais</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                        <textarea
                            value={observations}
                            onChange={(e) => setObservations(e.target.value)}
                            placeholder="Algum pormenor a considerar?"
                            rows={3}
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-10 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
      </div>

      {/* COLUMN 3: DATE & SUBMIT */}
      <div className="flex flex-col gap-6">
        <motion.div custom={3} variants={formItemVariant}>
            <div className="flex items-center gap-2 mb-4 text-primary">
                <CalendarIcon className="w-5 h-5" />
                <h3 className="font-display font-bold uppercase tracking-widest text-sm">3. Data Pretendida</h3>
            </div>
            
            <div className="bg-gray-50 p-2 rounded-2xl border-2 border-gray-100 flex justify-center">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() }
                    className="p-1"
                />
            </div>
        </motion.div>

        <motion.div custom={4} variants={formItemVariant} className="mt-auto">
            <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 rounded-2xl font-display text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${
                    submitting ? "bg-gray-100 text-gray-400" : "bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] shadow-xl shadow-primary/20"
                }`}
            >
                {submitting ? (
                    <>
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                        <span>A enviar...</span>
                    </>
                ) : (
                    <span>{isAdmin ? "Adicionar ao Calendário" : "Pedir Orçamento"}</span>
                )}
            </button>
            {onClose && (
                <button type="button" onClick={onClose} className="w-full mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">
                    Cancelar
                </button>
            )}
        </motion.div>
      </div>
    </motion.form>
  );
};
