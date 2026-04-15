import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Star, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

export default function ClientProfile() {
  const { user, logout, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      const unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
        if (doc.exists()) {
          setProfile(doc.data());
        }
        setLoading(false);
      });
      return () => unsub();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile?.points >= 10) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [profile?.points]);

  const POINTS_NEEDED = 10;

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar activeTab="" onTabChange={() => navigate('/')} />
      
      <main className="pt-32 pb-24 container max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Olá, {profile?.name?.split(' ')[0]}!</h1>
            <p className="text-muted-foreground text-sm">Consulte o progresso do seu cartão de fidelidade.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => logout()} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </div>

        {/* Loyalty Card Container */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden"
        >
          {/* Card background effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Star className="w-6 h-6 fill-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl uppercase tracking-wider">Cartão Fidelidade</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Nauticare Elite</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-4xl font-display font-bold text-primary">{profile?.points || 0}</span>
                <span className="text-muted-foreground text-sm ml-1">/ {POINTS_NEEDED}</span>
              </div>
            </div>

            {/* Grid of Points */}
            <div className="grid grid-cols-5 gap-3 md:gap-6">
              {[...Array(POINTS_NEEDED)].map((_, i) => {
                const isEarned = (profile?.points || 0) > i;
                const isNext = (profile?.points || 0) === i;
                
                return (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                      isEarned 
                        ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' 
                        : isNext
                          ? 'bg-white dark:bg-gray-800 border-primary border-dashed animate-pulse'
                          : 'bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-600'
                    }`}
                  >
                    {isEarned ? (
                      <Check className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
                    ) : (
                      <span className={`text-lg font-bold ${isNext ? 'text-primary' : 'text-gray-300 dark:text-gray-600'}`}>
                        {i + 1}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-12 p-6 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm text-primary">
                  🎁
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Prémio: Próximo Nível</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                    Complete 10 serviços para ganhar uma **Lavagem Premium Grátis** ou 50% de desconto num polimento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
