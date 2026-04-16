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
        </div>        {/* Premium Loyalty Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative group h-full"
        >
          {/* Card background effect */}
          <div className="absolute inset-0 bg-slate-900 rounded-[3rem] shadow-3xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-20 -mt-20 blur-[100px] transition-all group-hover:bg-primary/30" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full -ml-20 -mb-20 blur-[100px]" />
          </div>
          
          <div className="relative z-10 bg-slate-900/40 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border border-white/10 text-white min-h-[400px] flex flex-col">
            <div className="flex justify-between items-start mb-12">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/40">
                  <Star className="w-8 h-8 text-white fill-white/20" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl tracking-wide uppercase">Nauticare Elite</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <p className="text-[10px] opacity-60 uppercase tracking-[0.2em] font-bold">Membro Ativo</p>
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] opacity-40 uppercase tracking-[0.2em] font-bold mb-1">Membro Desde</span>
                <span className="font-display font-bold text-xl">{profile?.created_at ? new Date(profile.created_at).getFullYear() : '2024'}</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center mb-12">
              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-sm opacity-60 font-body">Balanço de Pontos</span>
                <div className="h-px flex-1 bg-white/5 mx-2" />
              </div>
              <div className="flex items-baseline gap-3">
                <h3 className="text-6xl md:text-7xl font-display font-bold tracking-tight text-white">
                  {profile?.points || 0}
                </h3>
                <span className="text-xl font-normal opacity-40 italic">serviços realizados</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <span className="opacity-60">Status:</span>
                  <span className="text-primary">{profile?.points >= 10 ? 'Gold Member' : 'Standard'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="opacity-60">Próxima Recompensa:</span>
                  <span className="text-primary">{Math.max(0, 10 - (profile?.points || 0))} serviços</span>
                </div>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-blue-500 shadow-[0_0_20px_rgba(30,58,138,0.5)]" 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, ((profile?.points || 0) / 10) * 100)}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
                <span>Progresso do Nível</span>
                <span>{Math.round(Math.min(100, ((profile?.points || 0) / 10) * 100))}%</span>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                  <Check className={`w-5 h-5 ${profile?.points >= 10 ? 'text-green-400' : 'text-primary'}`} />
                </div>
                <div>
                  <p className="text-sm font-bold">Oferta Disponível</p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                    {profile?.points >= 10 ? 'LAVAGEM PREMIUM GRÁTIS' : 'LAVAGEM PREMIUM (BLOQUEADO)'}
                  </p>
                </div>
              </div>
              
              {profile?.points >= 10 && (
                <Button 
                  className="bg-primary text-white hover:bg-white hover:text-slate-900 transition-all rounded-xl font-bold uppercase tracking-widest text-[10px] py-6 px-8"
                  onClick={() => navigate('/#reservar')}
                >
                  Resgatar Agora
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
