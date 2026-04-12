import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-dark.png";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { BookingForm, BookingFormData } from "@/components/BookingForm";
import { supabase } from "@/lib/supabase";
import { format, parseISO } from "date-fns";

interface Booking {
    id: number;
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

  const fetchBookings = async () => {
      setBookingsLoading(true);
      setBookingsError(null);
      const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });

      if (error) {
          console.error("Error fetching bookings:", error);
          setBookingsError("Não foi possível carregar as reservas.");
      } else {
          const allBookings = data as Booking[];
          setBookings(allBookings);

          const bookingsByDate = allBookings.reduce((acc, booking) => {
            const date = booking.date;
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(booking);
            return acc;
          }, {} as Record<string, Booking[]>);

          const orangeDays: Date[] = [];
          const greenDays: Date[] = [];

          for (const dateStr in bookingsByDate) {
            const bookingsOnDay = bookingsByDate[dateStr];
            const allConfirmed = bookingsOnDay.every(b => b.is_confirmed);
            
            if (allConfirmed) {
              greenDays.push(parseISO(dateStr));
            } else {
              orangeDays.push(parseISO(dateStr));
            }
          }

          setBookedDays(orangeDays);
          setConfirmedDays(greenDays);
      }
      setBookingsLoading(false);
  };

  useEffect(() => {
    if(isAuthenticated) {
        fetchBookings();
    }
  }, [isAuthenticated]);

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

    const { error } = await supabase
      .from('bookings')
      .insert([
        {
          date: format(date, "yyyy-MM-dd"),
          boat_size: boatSize,
          services,
          name,
          email,
          phone,
          boat_name: boatName,
          marina,
          observations,
        },
      ]);

    if (error) {
      console.error('Error inserting booking:', error);
    } else {
      await fetchBookings();
      setBookingFormOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!bookingToDelete) return;
    const { error } = await supabase.from('bookings').delete().match({ id: bookingToDelete.id });
    if (error) {
        console.error('Error deleting booking:', error.message);
    } else {
        await fetchBookings();
        setBookingToDelete(null);
    }
  };

  const handleConfirm = async () => {
    if (!selectedBooking) return;
    const { data, error } = await supabase.from('bookings').update({ is_confirmed: true }).match({ id: selectedBooking.id });
    if (error) {
        console.error('Error confirming booking:', error.message);
    } else {
        await fetchBookings();
        setSelectedBooking(null);
    }
  }

  if (isAuthenticated) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <header className="bg-white dark:bg-gray-800 shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <img src={logo} alt="Logo" className="h-10" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <Button onClick={() => setBookingFormOpen(true)}>Adicionar reserva manualmente</Button>
                </div>
            </header>
            <main className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
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
            </main>
    
            <Dialog open={isBookingFormOpen} onOpenChange={setBookingFormOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
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
                        <p><b>Tamanho do Barco:</b> {selectedBooking?.boat_size}</p>
                        <p><b>Porto:</b> {selectedBooking?.marina}</p>
                        <p><b>Serviços:</b> {selectedBooking?.services && selectedBooking.services.length > 0 ? selectedBooking.services.join(', ') : 'Nenhum'}</p>
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
