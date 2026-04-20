import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { Calendar as CalendarIcon, Clock, Ship, ChevronRight, CheckCircle2, ChevronDown } from "lucide-react";
import emailjs from '@emailjs/browser';
import { Calendar } from "@/components/ui/calendar";
import { CustomPhoneInput } from "./PhoneInput";
import { isValidPhoneNumber } from 'react-phone-number-input';
import { format } from "date-fns";
import { useLiveContent } from "@/hooks/useLiveContent";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { boatSizeCategories, type BoatSize, categories } from "@/data/services";

const locations = ["Doca das Fontainhas", "Marina de Tróia"];

export interface BookingFormData {
  date: Date;
  boatSize: BoatSize | "";
  services: string[];
  name: string;
  email: string;
  phone: string;
  boatName: string;
  marina: string;
  observations: string;
}

interface BookingFormProps {
  setSubmitted?: (submitted: boolean) => void;
  onSubmit?: (data: BookingFormData) => void;
  isAdmin?: boolean;
}

export const BookingForm = ({ setSubmitted, onSubmit, isAdmin }: BookingFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { services, packs, boatSizes } = useLiveContent();
  const [submitting, setSubmitting] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPack, setSelectedPack] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [boatName, setBoatName] = useState("");
  const [userBoats, setUserBoats] = useState<string[]>([]);
  const [isManualBoat, setIsManualBoat] = useState(false);
  const [boatSize, setBoatSize] = useState<BoatSize | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+351");
  const [observations, setObservations] = useState("");

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    if (selectedPack) setSelectedPack("");
  };

  const selectPack = (id: string) => {
    setSelectedPack(id === selectedPack ? "" : id);
    if (id !== selectedPack) setSelectedServices([]);
  };

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email.toLowerCase());
      
      // Fetch additional profile info
      const fetchProfile = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.name) setName(data.name);
            if (data.phone) setPhone(data.phone);
            
            // Handle boats (migration or array)
            if (data.boats && data.boats.length > 0) {
               setUserBoats(data.boats.filter(Boolean));
               setBoatName(data.boats[0]);
               setIsManualBoat(false);
            } else if (data.boatName) {
               setUserBoats([data.boatName]);
               setBoatName(data.boatName);
               setIsManualBoat(false);
            }
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

    if ((selectedServices.length === 0 && !selectedPack) || !name || !email || !phone || !selectedDate) {
        toast({
          title: "Campos em falta",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
    }

    // Validation for Portuguese numbers (starts with +351)
    if (phone && phone.startsWith('+351')) {
      const digitsOnly = phone.replace(/\D/g, '');
      if (digitsOnly.length !== 12) { // 351 + 9 digits = 12
        toast({
          title: "Número Inválido",
          description: "O número de telemóvel deve ter exatamente 9 dígitos.",
          variant: "destructive"
        });
        return;
      }
    } else if (phone && !isValidPhoneNumber(phone)) {
        toast({
          title: "Número Inválido",
          description: "Por favor, insira um número de telefone válido.",
          variant: "destructive"
        });
        return;
    }

    const formData: BookingFormData = {
      date: selectedDate,
      boatSize,
      services: selectedPack ? [selectedPack] : selectedServices,
      name,
      email,
      phone,
      boatName,
      marina: selectedLocation,
      observations,
    };

    if (onSubmit) {
      onSubmit(formData);
    } else if (setSubmitted) {
      // Guest submission to Firebase
      const saveGuestBooking = async () => {
        setSubmitting(true);
        try {
          const cleanEmail = email.toLowerCase().trim();
          
          await addDoc(collection(db, 'bookings'), {
            date: format(selectedDate, "yyyy-MM-dd"),
            boat_size: boatSize,
            services: selectedPack ? [selectedPack] : selectedServices,
            name,
            email: cleanEmail,
            phone,
            boat_name: boatName,
            marina: selectedLocation,
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
            boat_size: boatSizes.find(c => c.id === boatSize)?.label || boatSize || "N/A",
            location: selectedLocation || "N/A",
            services_or_pack: selectedPack 
              ? (packs.find(p => p.id === selectedPack)?.name || selectedPack) 
              : selectedServices.map(id => services.find(s => s.id === id)?.name || id).join(', '),
          };

          // Also set to_email for the recipient if configured in EmailJS settings
          // (assuming user_email is the client email)
          const finalParams = {
            ...templateParams,
            to_email: email, // Keep this just in case for the "To Email" field
          };

          await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            finalParams,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
          );

          setSubmitted(true);
        } catch (err: any) {
          console.error("Error saving booking:", err);
          toast({
            title: "Erro ao Reservar",
            description: "Não foi possível completar a sua reserva. Por favor, tente novamente.",
            variant: "destructive"
          });
        } finally {
            setSubmitting(false);
        }
      };
      saveGuestBooking();
    }
  };

  const isSubmitDisabled = (selectedServices.length === 0 && !selectedPack) || !name || !phone || !selectedDate;

  const formItemVariant: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({ 
      y: 0, 
      opacity: 1, 
      transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } 
    })
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 md:gap-y-6 bg-white p-3 md:p-8 rounded-xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* ---- COLUMN 1: SERVICES ---- */}
      <div className="lg:col-span-1 flex flex-col gap-4 md:gap-6">
        {/* Individual Services */}
        <motion.div custom={0} variants={formItemVariant}>
          <label className="font-body text-xs md:text-sm font-semibold tracking-wide text-gray-700 mb-2 md:mb-3 block">
            1. Escolha os Serviços
          </label>
          <div className="space-y-2">
            {services.map((service) => (
              <label
                key={service.id}
                className={`flex items-center gap-3 border-2 rounded-md px-4 py-3 cursor-pointer transition-all duration-200 ${
                  selectedServices.includes(service.id)
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 bg-white hover:border-primary/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service.id)}
                  onChange={() => toggleService(service.id)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  selectedServices.includes(service.id)
                    ? "bg-primary border-primary"
                    : "border-gray-300 bg-white"
                }`}>
                  {selectedServices.includes(service.id) && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="font-body text-sm text-gray-800">{service.name}</span>
              </label>
            ))}
          </div>
        </motion.div>

        {/* Packs */}
        <motion.div custom={1} variants={formItemVariant}>
          <label className="font-body text-xs uppercase tracking-widest text-gray-500 mb-3 block">
            Ou escolha um Pack
          </label>
          <div className="space-y-2">
            {packs.map((pack) => (
              <label
                key={pack.id}
                className={`flex items-center gap-3 border-2 rounded-md px-4 py-3 cursor-pointer transition-all duration-200 ${
                  selectedPack === pack.id
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 bg-white hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  name="pack"
                  checked={selectedPack === pack.id}
                  onChange={() => selectPack(pack.id)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  selectedPack === pack.id
                    ? "border-primary bg-white"
                    : "border-gray-300"
                }`}>
                  {selectedPack === pack.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
                <span className="font-body text-sm text-gray-800">{pack.name}</span>
              </label>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ---- COLUMN 2: DETAILS ---- */}
      <div className="lg:col-span-1 flex flex-col gap-5">
        <motion.div custom={2} variants={formItemVariant}>
          <label className="font-body text-sm font-semibold tracking-wide text-gray-700 mb-3 block">
            2. Detalhes da Embarcação
          </label>
          <div className="space-y-4">
            {/* Location */}
            <div className="flex gap-2">
              {locations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setSelectedLocation(selectedLocation === loc ? "" : loc)}
                  className={`flex-1 border-2 rounded-md px-4 py-2.5 font-body text-sm transition-all duration-200 ${
                    selectedLocation === loc
                      ? "border-primary bg-primary text-white shadow-md font-bold"
                      : "border-gray-300 text-gray-600 hover:border-primary/50 bg-white"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            {/* Boat size */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {boatSizes.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => setBoatSize(boatSize === size.id ? "" : size.id)}
                className={`flex flex-col items-center justify-center p-3 sm:p-5 min-h-[70px] rounded-md border-2 transition-all duration-200 text-center ${
                  boatSize === size.id
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-gray-200 bg-white text-gray-700 hover:border-primary/50"
                }`}
              >
                <span className="font-display font-bold text-sm sm:text-lg leading-tight">
                  {size.label}
                </span>
              </button>
            ))}
          </div>

            {/* Boat name selector - Wrapped in space-y-2 for better separation from sizes */}
            <div className="space-y-2 pt-2">
              {!isManualBoat && userBoats.length > 0 ? (
                <div className="space-y-2">
                  <select
                    value={boatName}
                    onChange={(e) => {
                      if (e.target.value === "NEW_BOAT") {
                        setIsManualBoat(true);
                        setBoatName("");
                      } else {
                        setBoatName(e.target.value);
                      }
                    }}
                    className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 font-body text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  >
                    {userBoats.map((boat, idx) => (
                      <option key={idx} value={boat}>{boat}</option>
                    ))}
                    <option value="NEW_BOAT">+ Outra embarcação...</option>
                  </select>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={boatName}
                    onChange={(e) => setBoatName(e.target.value)}
                    placeholder="Nome da Embarcação (opcional)"
                    className={`w-full bg-white border-2 border-gray-300 rounded-xl py-3 font-body text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${userBoats.length > 0 ? 'pl-4 pr-12' : 'px-4'}`}
                  />
                  {userBoats.length > 0 && (
                    <button 
                      type="button"
                      onClick={() => { setIsManualBoat(false); setBoatName(userBoats[0]); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/5 rounded-full transition-colors flex items-center justify-center"
                      title="Voltar à seleção"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div custom={3} variants={formItemVariant}>
          <label className="font-body text-sm font-semibold tracking-wide text-gray-700 mb-3 block">
            3. Os seus Contactos
          </label>
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="O seu Nome *"
              className="w-full bg-white border-2 border-gray-300 rounded-md px-4 py-2.5 font-body text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="O seu Email *"
              className="w-full bg-white border-2 border-gray-300 rounded-md px-4 py-2.5 font-body text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
            <CustomPhoneInput
              value={phone}
              onChange={setPhone}
              placeholder="Contacto Telefónico *"
              className="bg-white"
            />
             <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Observações (opcional)"
              rows={3}
              className="w-full bg-white border-2 border-gray-300 rounded-md px-4 py-2.5 font-body text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
            />
          </div>
        </motion.div>
      </div>

      {/* ---- COLUMN 3: CALENDAR & SUBMIT ---- */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <motion.div custom={4} variants={formItemVariant}>
          <label className="font-body text-sm font-semibold tracking-wide text-gray-700 mb-3 block">
            4. Data Pretendida *
          </label>
          <div className="border-2 border-gray-200 rounded-md p-1 bg-white flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1)) }
              className="font-body p-2"
            />
          </div>
        </motion.div>

        <motion.div custom={5} variants={formItemVariant} className="mt-auto flex flex-col gap-4">
          {/* Summary */}
          {(selectedServices.length > 0 || selectedPack) && (
            <div className="border border-dashed border-gray-300 rounded-md p-4 bg-gray-50/80">
              <p className="font-body text-xs uppercase tracking-wider text-gray-500 mb-3">Resumo do Pedido</p>
              <div className="space-y-1.5">
                {selectedPack ? (
                  <p className="font-body text-sm text-gray-700 font-medium">
                    {packs.find(p => p.id === selectedPack)?.name}
                  </p>
                ) : (
                  selectedServices.map(id => (
                    <div key={id} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-primary/80">-</span>
                      <span>{services.find(s => s.id === id)?.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitDisabled || submitting}
            className={`w-full py-5 rounded-full font-display text-sm uppercase tracking-[0.2em] font-bold transition-all duration-500 relative overflow-hidden group ${
              isSubmitDisabled || submitting
                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] shadow-2xl shadow-primary/20 active:scale-[0.98]"
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>A Processar...</span>
                </>
              ) : (
                <>
                  <span>{isAdmin ? "Confirmar e Agendar" : "Pedir Orçamento Grátis"}</span>
                </>
              )}
            </div>
          </button>
        </motion.div>
      </div>
    </motion.form>
  );
};