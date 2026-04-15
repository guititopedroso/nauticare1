import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, Clock, Anchor, MapPin, CheckCircle2, XCircle, Info, ChevronRight, Package, Tool, Shield } from 'lucide-react';
import { format, parseISO, isAfter } from 'date-fns';
import { pt } from 'date-fns/locale';
import { services as servicesData, packs as packsData } from '@/data/services';

interface Booking {
  id: string;
  date: string;
  boat_size: string;
  boat_name: string;
  services: string[];
  is_confirmed: boolean;
  marina: string;
  created_at: string;
  observations?: string;
}

export default function ClientBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const q = query(
      collection(db, 'bookings'),
      where('email', '==', user.email),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setBookings(bks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getServiceInfo = (id: string) => {
    const srv = servicesData.find(s => s.id === id);
    if (srv) return { name: srv.name, type: 'service' };
    const pck = packsData.find(p => p.id === id);
    if (pck) return { name: pck.name, type: 'pack' };
    return { name: id, type: 'unknown' };
  };

  const isPast = (dateStr: string) => {
    try {
        return !isAfter(parseISO(dateStr), new Date());
    } catch {
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
      <Navbar activeTab="" onTabChange={() => {}} />

      <main className="pt-32 pb-24 container max-w-5xl">
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-display font-bold text-gray-900 dark:text-white"
          >
            As Minhas Reservas
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 mt-2 font-body"
          >
            Acompanhe o estado das suas marcações e o histórico de intervenções.
          </motion.p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 animate-pulse">A carregar as suas reservas...</p>
          </div>
        ) : bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 shadow-sm"
          >
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ainda não tem reservas</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Quando solicitar um serviço de limpeza ou manutenção, ele aparecerá aqui para poder acompanhar.
            </p>
            <a 
              href="/#reservar" 
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/25"
            >
              Fazer a minha primeira reserva
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode='popLayout'>
              {bookings.map((booking, idx) => {
                const past = isPast(booking.date);
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border ${
                      booking.is_confirmed 
                        ? 'border-green-100 dark:border-green-900/30' 
                        : 'border-amber-100 dark:border-amber-900/30'
                    } group hover:shadow-md transition-all duration-300`}
                  >
                    <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x dark:divide-gray-800">
                      {/* Left: Date & Status */}
                      <div className={`p-6 md:w-48 flex flex-col items-center justify-center text-center ${
                        booking.is_confirmed ? 'bg-green-50/50 dark:bg-green-900/10' : 'bg-amber-50/50 dark:bg-amber-900/10'
                      }`}>
                        <div className="text-3xl font-display font-bold text-gray-900 dark:text-white line-clamp-1">
                          {format(parseISO(booking.date), 'dd')}
                        </div>
                        <div className="text-sm font-body uppercase tracking-tighter text-gray-500 dark:text-gray-400">
                          {format(parseISO(booking.date), 'MMM yyyy', { locale: pt })}
                        </div>
                        <div className={`mt-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                          booking.is_confirmed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-amber-500 text-white'
                        }`}>
                          {booking.is_confirmed ? (
                            <><CheckCircle2 className="w-3 h-3" /> Confirmada</>
                          ) : (
                            <><Clock className="w-3 h-3" /> Pendente</>
                          )}
                        </div>
                        {past && (
                           <div className="mt-2 text-[10px] font-medium text-gray-400 uppercase tracking-tighter">
                             Concluída
                           </div>
                        )}
                      </div>

                      {/* Middle: Details */}
                      <div className="p-6 flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Anchor className="w-4 h-4 text-blue-500" />
                              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white uppercase tracking-tight">
                                {booking.boat_name}
                              </h3>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" /> {booking.marina}
                              </span>
                              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[10px] font-bold">
                                {booking.boat_size === "ate7m" ? "Até 7m" : 
                                 booking.boat_size === "7a12m" ? "7-12m" : 
                                 booking.boat_size === "12a18m" ? "12-18m" : "> 18m"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="hidden sm:block text-right">
                             <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Pedido em:</span>
                             <p className="text-xs text-gray-500">{booking.created_at ? format(new Date(booking.created_at), 'dd/MM/yyyy') : '---'}</p>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                             Serviços Contratados
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {booking.services.map(sId => {
                                const info = getServiceInfo(sId);
                                return (
                                  <div key={sId} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                                    info.type === 'pack' 
                                      ? 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/20 dark:border-blue-900/30 dark:text-blue-400' 
                                      : 'bg-gray-50 border-gray-100 text-gray-700 dark:bg-gray-800/50 dark:border-gray-800 dark:text-gray-300'
                                  }`}>
                                    {info.type === 'pack' ? <Package className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                                    {info.name}
                                  </div>
                                );
                            })}
                          </div>
                        </div>

                        {booking.observations && (
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg flex gap-3">
                             <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                             <p className="text-xs text-gray-500 italic">"{booking.observations}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
