import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { app, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import logo from '@/assets/logo-dark.png';

export default function ClientLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/area-cliente');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create user profile in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          points: 0,
          created_at: new Date().toISOString()
        });
        navigate('/area-cliente');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao processar autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar activeTab="" onTabChange={() => navigate('/')} />
      
      <main className="pt-32 pb-24 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <img src={logo} alt="Nauticare" className="h-10" />
            </div>
            
            <h2 className="text-2xl font-display font-bold text-center mb-2">
              {isLogin ? 'Bem-vindo de volta' : 'Criar conta Nauticare'}
            </h2>
            <p className="text-muted-foreground text-center text-sm mb-8">
              {isLogin ? 'Entre para consultar os seus pontos' : 'Registe-se para começar a acumular benefícios'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Nome Completo</label>
                  <Input 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    placeholder="O seu nome"
                    className="rounded-lg"
                  />
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Email</label>
                <Input 
                  required 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Password</label>
                <Input 
                  required 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-lg"
                />
              </div>

              {error && <p className="text-red-500 text-xs text-center">{error}</p>}

              <Button 
                type="submit" 
                className="w-full py-6 rounded-lg text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? 'A processar...' : (isLogin ? 'Entrar' : 'Criar Conta')}
              </Button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-muted-foreground">
                {isLogin ? 'Não tem conta?' : 'Já tem uma conta?'} 
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1 text-primary font-semibold hover:underline"
                >
                  {isLogin ? 'Crie uma aqui' : 'Entre aqui'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
