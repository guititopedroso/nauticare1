import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-dark.png";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingForm, BookingFormData } from "@/components/BookingForm";
import { services, packs, boatSizeCategories } from "@/data/services";
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy, Timestamp, setDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { format, parseISO } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Phone } from "lucide-react";

interface Booking {
    id: string;
    created_at: string;
    date: string;
    boat_size: string;
    services: string[];
    name: string;
    email: string;
    phone: string;
    boat_name: string;
    marina: string;
    observations?: string;
    is_confirmed: boolean;
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [isBookingFormOpen, setBookingFormOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [bookedDays, setBookedDays] = useState<Date[]>([]);
  const [confirmedDays, setConfirmedDays] = useState<Date[]>([]);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [editorTab, setEditorTab] = useState("servicos");
  const [liveServices, setLiveServices] = useState<any[]>([]);
  const [livePacks, setLivePacks] = useState<any[]>([]);
  const [liveBoatSizes, setLiveBoatSizes] = useState<any[]>([]);
  const [isEditingService, setIsEditingService] = useState<any>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<any>(null);
  const [isEditingPack, setIsEditingPack] = useState<any>(null);
  const [isEditingBoatSize, setIsEditingBoatSize] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  const handleUpdatePoints = async (customerId: string, newPoints: number) => {
    try {
      await updateDoc(doc(db, 'users', customerId), { points: newPoints });
      setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, points: newPoints } : c));
    } catch (err) {
      console.error("Error updating points:", err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubBookings: () => void;
    let unsubCustomers: () => void;
    let unsubServices: () => void;
    let unsubPacks: () => void;
    let unsubSizes: () => void;

    // LIVE BOOKINGS
    if (activeTab === "bookings") {
      setBookingsLoading(true);
      const q = query(collection(db, 'bookings'), orderBy('created_at', 'desc'));
      unsubBookings = onSnapshot(q, (snapshot) => {
        const allBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
        setBookings(allBookings);
        
        // Process days
        const bookingsByDate = allBookings.reduce((acc, b) => {
          if (!acc[b.date]) acc[b.date] = [];
          acc[b.date].push(b);
          return acc;
        }, {} as Record<string, Booking[]>);

        const orange: Date[] = [];
        const green: Date[] = [];
        for (const d in bookingsByDate) {
          if (bookingsByDate[d].every(b => b.is_confirmed)) green.push(parseISO(d));
          else orange.push(parseISO(d));
        }
        setBookedDays(orange);
        setConfirmedDays(green);
        setBookingsLoading(false);
      }, (err) => console.error(err));
    }

    // LIVE CLIENTES
    if (activeTab === "clientes") {
      setCustomersLoading(true);
      unsubCustomers = onSnapshot(collection(db, 'users'), (snapshot) => {
        setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setCustomersLoading(false);
      });
    }

    // LIVE EDITOR
    if (activeTab === "editor") {
      unsubServices = onSnapshot(collection(db, 'services'), async (snap) => {
        if (snap.empty) {
          // SEED
          for (const s of services) await setDoc(doc(db, 'services', s.id), s);
        } else {
          setLiveServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      });
      unsubPacks = onSnapshot(collection(db, 'packs'), (snap) => {
        setLivePacks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
      unsubSizes = onSnapshot(collection(db, 'boat_sizes'), (snap) => {
        setLiveBoatSizes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    }

    return () => {
      if (unsubBookings) unsubBookings();
      if (unsubCustomers) unsubCustomers();
      if (unsubServices) unsubServices();
      if (unsubPacks) unsubPacks();
      if (unsubSizes) unsubSizes();
    };
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    const isAdmin = localStorage.getItem("nauticare_admin");
    if (isAdmin === "true") {
      setIsAuthenticated(true);
    }
  }, []);


  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingService) return;
    try {
      await setDoc(doc(db, 'services', isEditingService.id), isEditingService);
      setIsEditingService(null);
    } catch (err) {
      console.error("Error updating service:", err);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingService) return;
    try {
      // Simple ID generation from name
      const id = isEditingService.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      await setDoc(doc(db, 'services', id), { ...isEditingService, id });
      setIsAddingService(false);
      setIsEditingService(null);
    } catch (err) {
      console.error("Error adding service:", err);
    }
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    try {
      await deleteDoc(doc(db, 'services', serviceToDelete.id));
      setServiceToDelete(null);
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'beforeImageUrl' | 'afterImageUrl' = 'imageUrl') => {
    const file = e.target.files?.[0];
    if (!file || !isEditingService) {
      console.log("Upload aborted: file or service missing", { file, isEditingService });
      return;
    }

    setIsUploading(true);
    try {
      console.log(`Starting upload of ${field} to Firebase Storage...`, file.name);
      const storageRef = ref(storage, `services/${Date.now()}_${field}_${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(uploadResult.ref);
      setIsEditingService({ ...isEditingService, [field]: url });
      console.log(`Service ${field} updated with URL:`, url);
    } catch (err: any) {
      console.error("Full upload error object:", err);
      // specific check for common Firebase errors
      if (err.code === 'storage/unauthorized') {
        alert("Erro: Sem permissão para carregar ficheiros. Verifique as 'Security Rules' no Storage do Firebase Console.");
      } else if (err.code === 'storage/unknown') {
        alert("Erro desconhecido. Verifique se o Storage está ativado no Firebase Console.");
      } else {
        alert("Erro ao carregar imagem: " + (err.message || "Erro desconhecido"));
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdatePack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingPack) return;
    try {
      await setDoc(doc(db, 'packs', isEditingPack.id), isEditingPack);
      await fetchLiveContent();
      setIsEditingPack(null);
    } catch (err) {
      console.error("Error updating pack:", err);
    }
  };

  const handleUpdateBoatSize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingBoatSize) return;
    try {
      await setDoc(doc(db, 'boat_sizes', isEditingBoatSize.id), isEditingBoatSize);
      await fetchLiveContent();
      setIsEditingBoatSize(null);
    } catch (err) {
      console.error("Error updating boat size:", err);
    }
  };

  useEffect(() => {
    if (selectedDay) {
      const formattedSelectedDay = format(selectedDay, "yyyy-MM-dd");
      const filtered = bookings.filter(booking => booking.date === formattedSelectedDay);
      setFilteredBookings(filtered);
    } else {
        setFilteredBookings([]);
    }
  }, [selectedDay, bookings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (password === "Nauticaredlmt2026") {
        localStorage.setItem("nauticare_admin", "true");
        setShowWelcome(true);
        setTimeout(() => {
            setIsAuthenticated(true);
        }, 2000) 
      } else {
        setError("Password incorreta");
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleBookingSubmit = async (data: BookingFormData) => {
    const { date, boatSize, services, name, email, phone, boatName, marina, observations } = data;

    try {
      await addDoc(collection(db, 'bookings'), {
        date: format(date, "yyyy-MM-dd"),
        boat_size: boatSize,
        services,
        name,
        email,
        phone,
        boat_name: boatName,
        marina,
        observations,
        is_confirmed: false,
        created_at: new Date().toISOString()
      });
      await fetchBookings();
      setBookingFormOpen(false);
    } catch (err) {
      console.error('Error inserting booking:', err);
    }
  };

  const handleDelete = async () => {
    if (!bookingToDelete) return;
    try {
      await deleteDoc(doc(db, 'bookings', bookingToDelete.id));
      await fetchBookings();
      setBookingToDelete(null);
    } catch (err) {
      console.error('Error deleting booking:', err);
    }
  };

  const handleConfirm = async () => {
    if (!selectedBooking) return;
    try {
      await updateDoc(doc(db, 'bookings', selectedBooking.id), {
        is_confirmed: true
      });
      await fetchBookings();
      setSelectedBooking(null);
    } catch (err) {
      console.error('Error confirming booking:', err);
    }
  };

  if (isAuthenticated) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <header className="bg-white dark:bg-gray-800 shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <img src={logo} alt="Logo" className="h-10" />
                        <nav className="hidden md:flex gap-4">
                            <button 
                                onClick={() => setActiveTab("bookings")}
                                className={`px-3 py-2 rounded-md font-medium ${activeTab === "bookings" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"}`}
                            >
                                Reservas
                            </button>
                            <button 
                                onClick={() => setActiveTab("clientes")}
                                className={`px-3 py-2 rounded-md font-medium ${activeTab === "clientes" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"}`}
                            >
                                Clientes
                            </button>
                            <button 
                                onClick={() => setActiveTab("editor")}
                                className={`px-3 py-2 rounded-md font-medium ${activeTab === "editor" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"}`}
                            >
                                Editor
                            </button>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                                localStorage.removeItem("nauticare_admin");
                                window.location.reload();
                            }}
                        >
                            Sair
                        </Button>
                        <Button onClick={() => setBookingFormOpen(true)}>Adicionar reserva manualmente</Button>
                    </div>
                </div>
            </header>
            
            <main className="container mx-auto py-8">
                {activeTab === "bookings" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Bookings Calendar</h2>
                            <Calendar 
                                mode="single" 
                                selected={selectedDay} 
                                onSelect={setSelectedDay}
                                modifiers={{ booked: bookedDays, confirmed: confirmedDays }}
                                modifiersClassNames={{ booked: 'booked-day', confirmed: 'confirmed-day' }}
                            />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Bookings para {selectedDay?.toLocaleDateString()}</h2>
                            {bookingsLoading ? (
                                <p>A carregar reservas...</p>
                            ) : bookingsError ? (
                                <p className="text-red-500">{bookingsError}</p>
                            ) : filteredBookings.length > 0 ? (
                                <div className="space-y-2">
                                    {filteredBookings.map(booking => (
                                        <Button key={booking.id} variant="ghost" className={`w-full justify-start ${booking.is_confirmed ? 'text-green-500' : ''}`} onClick={() => setSelectedBooking(booking)}>
                                            {booking.boat_name}
                                        </Button>
                                    ))}
                                </div>
                            ) : (
                                <p>Nenhuma reserva para este dia.</p>
                            )}
                        </motion.div>
                    </div>
                )}

                {activeTab === "editor" && (
                    <div className="space-y-6">
                        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                            <button 
                                onClick={() => setEditorTab("servicos")}
                                className={`pb-2 px-1 font-medium text-sm transition-colors relative ${editorTab === "servicos" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Serviços
                                {editorTab === "servicos" && <motion.div layoutId="editor-underline" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-blue-600" />}
                            </button>
                            <button 
                                onClick={() => setEditorTab("galeria")}
                                className={`pb-2 px-1 font-medium text-sm transition-colors relative ${editorTab === "galeria" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Galeria
                                {editorTab === "galeria" && <motion.div layoutId="editor-underline" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-blue-600" />}
                            </button>
                        </div>

                        {editorTab === "servicos" ? (
                            <div className="space-y-8">
                                <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Serviços</h2>
                                        <Button onClick={() => {
                                            setIsAddingService(true);
                                            setIsEditingService({
                                                name: "",
                                                description: "",
                                                detailedDescription: "",
                                                price: "Sob consulta",
                                                category: "estetica",
                                                prices: { ate7m: "", "7a12m": "", "12a18m": "", mais18m: "" }
                                            });
                                        }}>Adicionar Novo Serviço</Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {liveServices.map(service => (
                                            <div key={service.id} className="border p-4 rounded-md flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-bold">{service.name}</h3>
                                                    <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>
                                                    <p className="mt-2 text-blue-600 font-semibold">{service.price}</p>
                                                </div>
                                                <div className="flex gap-2 mt-4">
                                                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setIsEditingService(service)}>Editar</Button>
                                                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setServiceToDelete(service)}>Remover</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Packs</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {livePacks.map(pack => (
                                            <div key={pack.id} className="border p-4 rounded-md flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-bold">{pack.name}</h3>
                                                    <p className="text-sm text-gray-500 line-clamp-2">{pack.description}</p>
                                                    <p className="mt-2 text-blue-600 font-semibold">{pack.price}</p>
                                                </div>
                                                <Button size="sm" variant="outline" className="mt-4" onClick={() => setIsEditingPack(pack)}>Editar</Button>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Categorias de Tamanho</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {liveBoatSizes.map(size => (
                                            <div key={size.id} className="border p-4 rounded-md flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-bold">{size.label}</h3>
                                                    <p className="text-sm text-gray-500">{size.description}</p>
                                                </div>
                                                <Button size="sm" variant="outline" className="mt-4" onClick={() => setIsEditingBoatSize(size)}>Editar</Button>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-md text-center">
                                <h3 className="text-xl font-bold mb-2">Editor de Galeria</h3>
                                <p className="text-gray-500">Funcionalidade de gestão de fotos em breve.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "clientes" && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Base de Clientes</h2>
                            <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-800">
                                <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm">{customers.length} Clientes Registados</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {customers.map(customer => {
                                const initials = (customer.name || "?").split(' ').filter(Boolean).map((n:any) => n[0]).join('').substring(0, 2).toUpperCase();
                                return (
                                    <motion.div 
                                        key={customer.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                                                    {initials}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{customer.name}</h3>
                                                        {(() => {
                                                            const lastSeen = customer.lastSeen?.toDate?.() || (customer.lastSeen ? new Date(customer.lastSeen) : null);
                                                            const isOnline = lastSeen && (new Date().getTime() - lastSeen.getTime()) < 1000 * 60 * 10;
                                                            return isOnline ? (
                                                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-[10px] font-bold text-green-700 dark:text-green-400 animate-pulse">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> ONLINE
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] text-gray-400 font-medium italic">
                                                                    visto há {lastSeen ? format(lastSeen, "HH:mm") : '---'}
                                                                </span>
                                                            );
                                                        })()}
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 mt-1">
                                                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                            {customer.email}
                                                        </div>
                                                        {customer.phone && (
                                                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                                <Phone className="w-3.5 h-3.5" />
                                                                {customer.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:items-end gap-2 shrink-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Embarcações:</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(customer.boats || [customer.boatName]).filter(Boolean).map((boat: string, i: number) => (
                                                            <span key={i} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                {boat}
                                                            </span>
                                                        )) || <span className="text-xs text-gray-400">-</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] uppercase tracking-tighter text-gray-400 font-bold mb-1">Pontos Fidelidade</span>
                                                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-xl border border-gray-100 dark:border-gray-700">
                                                        <Button 
                                                            size="icon" 
                                                            variant="ghost" 
                                                            className="h-8 w-8 rounded-lg hover:bg-white dark:hover:bg-gray-800 shadow-sm"
                                                            onClick={() => handleUpdatePoints(customer.id, Math.max(0, (customer.points || 0) - 1))}
                                                        >-</Button>
                                                        <span className="text-xl font-display font-black text-blue-600 min-w-[1.5rem] text-center">
                                                            {customer.points || 0}
                                                        </span>
                                                        <Button 
                                                            size="icon" 
                                                            variant="ghost"
                                                            className="h-8 w-8 rounded-lg hover:bg-white dark:hover:bg-gray-800 shadow-sm"
                                                            onClick={() => handleUpdatePoints(customer.id, (customer.points || 0) + 1)}
                                                        >+</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            
                            {customers.length === 0 && (
                                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                                    <p className="text-gray-500 font-medium">Nenhum cliente registado no sistema.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
    
            <Dialog open={!!isEditingService} onOpenChange={() => { setIsEditingService(null); setIsAddingService(false); }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isAddingService ? "Adicionar Novo Serviço" : `Editar Serviço: ${isEditingService?.name}`}</DialogTitle>
                    </DialogHeader>
                    {isEditingService && (
                        <form onSubmit={isAddingService ? handleAddService : handleUpdateService} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nome</label>
                                <Input required value={isEditingService.name} onChange={e => setIsEditingService({...isEditingService, name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Categoria</label>
                                <select 
                                    className="w-full border rounded-md p-2 text-sm"
                                    value={isEditingService.category} 
                                    onChange={e => setIsEditingService({...isEditingService, category: e.target.value})}
                                >
                                    <option value="estetica">Estética & Detalhe</option>
                                    <option value="manutencao">Manutenção & Técnica</option>
                                    <option value="gestao">Gestão & Segurança</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Preço (Ex: A partir de 50€)</label>
                                <Input value={isEditingService.price} onChange={e => setIsEditingService({...isEditingService, price: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Descrição Curta</label>
                                <Input value={isEditingService.description} onChange={e => setIsEditingService({...isEditingService, description: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Imagem do Serviço</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-400 transition-colors bg-gray-50/50 dark:bg-gray-700/30 relative overflow-hidden group">
                                    {isEditingService.imageUrl ? (
                                        <div className="relative w-full aspect-video rounded-md overflow-hidden shadow-sm">
                                            <img src={isEditingService.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button 
                                                    type="button" 
                                                    variant="destructive" 
                                                    size="sm"
                                                    onClick={() => setIsEditingService({...isEditingService, imageUrl: ""})}
                                                >
                                                    Remover Foto
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 text-center">
                                            <div className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors">
                                                <svg className="h-full w-full" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                    <span>Carregar uma foto</span>
                                                    <input 
                                                        type="file" 
                                                        className="sr-only" 
                                                        accept="image/*"
                                                        onChange={(e) => handleFileUpload(e, 'imageUrl')}
                                                        disabled={isUploading}
                                                    />
                                                </label>
                                                <p className="pl-1">ou arraste para aqui</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                                        </div>
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex flex-col items-center justify-center backdrop-blur-[1px]">
                                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                                            <p className="text-sm font-medium text-blue-600">A processar...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Interactive Comparison Images */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Foto Antes (Sujo)</label>
                                    <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors bg-gray-50/50 relative overflow-hidden group">
                                        {isEditingService.beforeImageUrl ? (
                                            <div className="relative w-full aspect-video rounded-md overflow-hidden">
                                                <img src={isEditingService.beforeImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <Button type="button" variant="destructive" size="sm" onClick={() => setIsEditingService({...isEditingService, beforeImageUrl: ""})}>Remover</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer text-center p-4">
                                                <div className="mx-auto h-8 w-8 text-gray-400"><svg className="h-full w-full" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                                                <p className="text-xs text-blue-600 font-semibold mt-1">Antes (Link)</p>
                                                <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileUpload(e, 'beforeImageUrl')} />
                                                <p className="text-[10px] text-gray-500 mt-1">Opcional</p>
                                            </label>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Foto Depois (Limpo)</label>
                                    <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors bg-gray-50/50 relative overflow-hidden group">
                                        {isEditingService.afterImageUrl ? (
                                            <div className="relative w-full aspect-video rounded-md overflow-hidden">
                                                <img src={isEditingService.afterImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <Button type="button" variant="destructive" size="sm" onClick={() => setIsEditingService({...isEditingService, afterImageUrl: ""})}>Remover</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer text-center p-4">
                                                <div className="mx-auto h-8 w-8 text-gray-400"><svg className="h-full w-full" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                                                <p className="text-xs text-blue-600 font-semibold mt-1">Depois (Link)</p>
                                                <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileUpload(e, 'afterImageUrl')} />
                                                <p className="text-[10px] text-gray-500 mt-1">Opcional</p>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Descrição Detalhada</label>
                                <Textarea rows={5} value={isEditingService.detailedDescription} onChange={e => setIsEditingService({...isEditingService, detailedDescription: e.target.value})} />
                            </div>

                            <div className="pt-4 border-t">
                                <h4 className="font-bold mb-4">Preços por Tamanho</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {liveBoatSizes.map(size => (
                                        <div key={size.id} className="space-y-2">
                                            <label className="text-xs font-medium">{size.label}</label>
                                            <Input 
                                                value={isEditingService.prices?.[size.id] || ""} 
                                                onChange={e => setIsEditingService({
                                                    ...isEditingService, 
                                                    prices: {
                                                        ...(isEditingService.prices || {}),
                                                        [size.id]: e.target.value
                                                    }
                                                })} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit">Guardar Alterações</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={!!isEditingPack} onOpenChange={() => setIsEditingPack(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar Pack: {isEditingPack?.name}</DialogTitle>
                    </DialogHeader>
                    {isEditingPack && (
                        <form onSubmit={handleUpdatePack} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nome</label>
                                <Input value={isEditingPack.name} onChange={e => setIsEditingPack({...isEditingPack, name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Preço</label>
                                <Input value={isEditingPack.price} onChange={e => setIsEditingPack({...isEditingPack, price: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Descrição</label>
                                <Textarea rows={3} value={isEditingPack.description} onChange={e => setIsEditingPack({...isEditingPack, description: e.target.value})} />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Guardar Alterações</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={!!isEditingBoatSize} onOpenChange={() => setIsEditingBoatSize(null)}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar Tamanho: {isEditingBoatSize?.label}</DialogTitle>
                    </DialogHeader>
                    {isEditingBoatSize && (
                        <form onSubmit={handleUpdateBoatSize} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Etiqueta (Label)</label>
                                <Input value={isEditingBoatSize.label} onChange={e => setIsEditingBoatSize({...isEditingBoatSize, label: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Descrição</label>
                                <Input value={isEditingBoatSize.description} onChange={e => setIsEditingBoatSize({...isEditingBoatSize, description: e.target.value})} />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Guardar Alterações</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={!!serviceToDelete} onOpenChange={() => setServiceToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar remoção de serviço</DialogTitle>
                        <DialogDescription>
                            Tem a certeza de que quer remover o serviço <strong>{serviceToDelete?.name}</strong>? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setServiceToDelete(null)}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDeleteService}>Remover</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isBookingFormOpen} onOpenChange={setBookingFormOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[90vw] lg:max-w-6xl">
                    <DialogHeader>
                        <DialogTitle>Adicionar reserva manualmente</DialogTitle>
                    </DialogHeader>
                    <BookingForm onSubmit={handleBookingSubmit} />
                </DialogContent>
            </Dialog>
    
            <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedBooking?.boat_name}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <p><b>Cliente:</b> {selectedBooking?.name}</p>
                        <p><b>Email:</b> {selectedBooking?.email}</p>
                        <p><b>Telefone:</b> {selectedBooking?.phone}</p>
                        <p><b>Tamanho do Barco:</b> {liveBoatSizes.find(c => c.id === selectedBooking?.boat_size)?.label || selectedBooking?.boat_size}</p>
                        <p><b>Porto:</b> {selectedBooking?.marina}</p>
                        <p><b>Serviços:</b> {selectedBooking?.services && selectedBooking.services.length > 0 
                            ? selectedBooking.services.map(id => {
                                const pack = packs.find(p => p.id === id);
                                if (pack) return pack.name;
                                const service = services.find(s => s.id === id);
                                if (service) return service.name;
                                return id;
                            }).join(', ') 
                            : 'Nenhum'}</p>
                        {selectedBooking?.observations && <p><b>Observações:</b> {selectedBooking?.observations}</p>}
                        <p><b>Estado:</b> {selectedBooking?.is_confirmed ? "Confirmada" : "Por confirmar"}</p>
                    </div>
                    <DialogFooter>
                        {!selectedBooking?.is_confirmed && (
                            <Button variant="default" onClick={handleConfirm}>Confirmar</Button>
                        )}
                        <Button variant="outline" onClick={() => setSelectedBooking(null)}>Fechar</Button>
                        <Button variant="destructive" onClick={() => {
                            setBookingToDelete(selectedBooking);
                            setSelectedBooking(null);
                        }}>Remover</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
    
            <Dialog open={!!bookingToDelete} onOpenChange={() => setBookingToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar remoção</DialogTitle>
                        <DialogDescription>
                            Tem a certeza de que quer remover a reserva para {bookingToDelete?.boat_name} no dia {bookingToDelete?.date}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBookingToDelete(null)}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDelete}>Remover</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
      );
  }

  if (showWelcome) {
    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-4xl font-bold text-gray-900 dark:text-white">Bem-Vindos Diogo e Martim!</motion.h1>
        </div>
    )
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      >
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="h-12" />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 bg-gray-200 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Aguarde..." : "Login"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
