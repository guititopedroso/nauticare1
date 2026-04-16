import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail
} from 'firebase/auth';
import emailjs from '@emailjs/browser';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import logo from '@/assets/logo-dark.png';
import { CustomPhoneInput } from '@/components/PhoneInput';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export default function ClientLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [userPhone, setUserPhone] = useState('+351');
  const [newUserId, setNewUserId] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Por favor, insira o seu email primeiro para recuperar a password.');
      return;
    }

    // Cooldown check (2 minutes)
    const lastSent = localStorage.getItem(`last_reset_${email}`);
    if (lastSent) {
      const timePassed = Date.now() - parseInt(lastSent);
      if (timePassed < 120000) { // 2 minutes in ms
          const timeLeft = Math.ceil((120000 - timePassed) / 1000);
          toast({
            title: "Aguarde um momento",
            description: `Pode solicitar um novo link em ${timeLeft} segundos.`,
            variant: "destructive"
          });
          return;
      }
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      
      // Save last sent time
      localStorage.setItem(`last_reset_${email}`, Date.now().toString());

      toast({
        title: "Email Enviado",
        description: "Verifique a sua caixa de entrada para o link de redefinição.",
      });
    } catch (err: any) {
      console.error(err);
      let userFriendlyMessage = 'Erro ao enviar email de recuperação.';
      if (err.code === 'auth/user-not-found') {
        userFriendlyMessage = 'Não existe nenhuma conta associada a este email.';
      } else if (err.code === 'auth/invalid-email') {
        userFriendlyMessage = 'O endereço de email introduzido não é válido.';
      }
      setError(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName || 'Utilizador Google',
          email: user.email,
          points: 0,
          created_at: new Date().toISOString()
        });
        setNewUserId(user.uid);
        setShowPhonePrompt(true);
      } else {
        navigate('/area-cliente');
      }
    } catch (err: any) {
      console.error(err);
      let userFriendlyMessage = 'Ocorreu um erro ao entrar com o Google.';
      if (err.code === 'auth/popup-blocked') {
        userFriendlyMessage = 'O seu navegador bloqueou o popup de login. Por favor, permita popups para este site.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        userFriendlyMessage = 'O login foi cancelado ou bloqueado.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        userFriendlyMessage = 'A janela de login foi fechada antes de completar o processo.';
      }
      setError(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

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
        setNewUserId(userCredential.user.uid);
        setShowPhonePrompt(true);
      }
    } catch (err: any) {
      console.error(err);
      
      // Mapeamento de erros amigáveis
      let userFriendlyMessage = 'Ocorreu um erro ao processar o seu pedido.';
      
      if (err.code) {
        switch (err.code) {
          case 'auth/invalid-email':
            userFriendlyMessage = 'O endereço de email introduzido não é válido.';
            break;
          case 'auth/user-disabled':
            userFriendlyMessage = 'Esta conta de utilizador foi desativada.';
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            userFriendlyMessage = 'Email ou password incorretos.';
            break;
          case 'auth/email-already-in-use':
            userFriendlyMessage = 'Este email já está registado. Por favor, faça login ou use outro.';
            break;
          case 'auth/weak-password':
            userFriendlyMessage = 'A password deve ter no mínimo 6 caracteres.';
            break;
          case 'auth/popup-blocked':
            userFriendlyMessage = 'O seu navegador bloqueou o popup de login. Por favor, permita popups para este site.';
            break;
          case 'auth/too-many-requests':
            userFriendlyMessage = 'Demasiadas tentativas falhadas. Por favor, aguarde uns minutos.';
            break;
          case 'auth/network-request-failed':
            userFriendlyMessage = 'Erro de rede. Verifique a sua ligação à internet.';
            break;
          case 'auth/internal-error':
            userFriendlyMessage = 'Ocorreu um erro interno. Por favor, tente novamente.';
            break;
          // Adicione outros casos se necessário
        }
      }
      
      setError(userFriendlyMessage);
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
                {isLogin && (
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Esqueceu-se da palavra-passe?
                    </button>
                  </div>
                )}
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

            <div className="mt-6 flex flex-col gap-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100 dark:border-gray-700"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">Ou continue com</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                type="button" 
                onClick={handleGoogleLogin}
                className="w-full py-6 rounded-lg border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex gap-3"
                disabled={loading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </div>

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

      <Dialog open={showPhonePrompt} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold text-blue-600">Falta apenas um detalhe!</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Para podermos entrar em contacto consigo em caso de necessidade e para gerir as suas reservas, pedimos o seu número de telemóvel.
            </p>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Telemóvel</label>
              <CustomPhoneInput
                value={userPhone}
                onChange={setUserPhone}
                className="w-full"
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
          <DialogFooter>
            <Button 
              className="w-full py-6 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
              disabled={loading || !userPhone || userPhone.length < 9}
              onClick={async () => {
                setLoading(true);
                try {
                  await updateDoc(doc(db, 'users', newUserId), {
                    phone: userPhone
                  });
                  setShowPhonePrompt(false);
                  navigate('/area-cliente');
                } catch (err) {
                  console.error(err);
                  setError('Erro ao guardar o contacto. Tente novamente.');
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? 'A guardar...' : 'Concluir Registo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
