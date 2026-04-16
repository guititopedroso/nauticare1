import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from 'lucide-react';
import { deleteUser } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { isValidPhoneNumber } from 'react-phone-number-input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Phone, Anchor, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomPhoneInput } from '@/components/PhoneInput';

export default function ClientSettings() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>({
    name: '',
    phone: '',
    boats: [],
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      const fetchProfile = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Migration: if has boatName but no boats array, convert it
          let boats = data.boats || [];
          if (boats.length === 0 && data.boatName) {
            boats = [data.boatName];
          }
          if (boats.length === 0) boats = ['']; // At least one empty field
          
          setProfile({ 
            ...data, 
            phone: data.phone || '+351',
            boats, 
            email: user.email 
          });
        }
        setLoading(false);
      };
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (profile.phone && profile.phone.startsWith('+351')) {
      const digitsOnly = profile.phone.replace(/\D/g, '');
      if (digitsOnly.length !== 12) {
        toast({
          title: "Número Inválido",
          description: "O número deve ter 9 dígitos.",
          variant: "destructive"
        });
        return;
      }
    } else if (profile.phone && !isValidPhoneNumber(profile.phone)) {
        toast({
          title: "Número Inválido",
          description: "Por favor insira um número válido.",
          variant: "destructive"
        });
        return;
    }
    
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: profile.name,
        phone: profile.phone || '',
        boats: profile.boats.filter((b: string) => b.trim() !== '')
      });
      toast({
        title: "Sucesso!",
        description: "Os seus dados foram atualizados.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Não foi possível guardar as alterações.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      // 1. Delete Firestore Data
      await deleteDoc(doc(db, 'users', user.uid));
      
      // 2. Delete Auth Account
      await deleteUser(user);
      
      toast({
        title: "Conta Eliminada",
        description: "A sua conta e dados foram removidos com sucesso.",
      });
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        toast({
          title: "Ação Necessária",
          description: "Por segurança, precisa de fazer logout e login novamente para eliminar a conta.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível eliminar a conta. Tente novamente mais tarde.",
          variant: "destructive"
        });
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar activeTab="" onTabChange={() => navigate('/')} />
      
      <main className="pt-32 pb-24 container max-w-2xl">
        <motion.button
          onClick={() => navigate('/area-cliente')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
        </motion.button>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <h1 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
            <User className="text-primary" /> Configurações de Perfil
          </h1>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Email (Não editável)</label>
              <Input value={profile.email} disabled className="bg-gray-50 dark:bg-gray-900/50" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input 
                  required 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="pl-10 h-12"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Telefone / WhatsApp</label>
              <CustomPhoneInput
                value={profile.phone} 
                onChange={(val: string) => setProfile({...profile, phone: val})}
                placeholder="+351 912 345 678"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider block">Minhas Embarcações</label>
              {profile.boats.map((boat: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <div className="relative flex-1">
                    <Anchor className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input 
                      value={boat} 
                      onChange={e => {
                        const newBoats = [...profile.boats];
                        newBoats[index] = e.target.value;
                        setProfile({...profile, boats: newBoats});
                      }}
                      className="pl-10 h-12"
                      placeholder={`Nome da embarcação ${index + 1}`}
                    />
                  </div>
                  {profile.boats.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-12 w-12 text-red-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => {
                        const newBoats = profile.boats.filter((_: any, i: number) => i !== index);
                        setProfile({...profile, boats: newBoats});
                      }}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="w-full border-dashed"
                onClick={() => setProfile({...profile, boats: [...profile.boats, '']})}
              >
                + Adicionar outra embarcação
              </Button>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full py-6 font-bold flex items-center justify-center gap-2 text-base transition-all active:scale-[0.98]"
                disabled={saving}
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <> <Save className="w-5 h-5" /> Guardar Alterações </>
                )}
              </Button>
            </div>
          </form>

          {/* Danger Zone */}
          <div className="mt-12 pt-8 border-t border-red-100">
            <h3 className="text-red-600 font-bold flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4" /> Zona de Perigo
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Ao eliminar a sua conta, perderá todos os seus pontos de fidelidade e histórico de reservas de forma permanente.
            </p>
            
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors">
                  Eliminar Minha Conta
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tem a certeza absoluta?</DialogTitle>
                  <DialogDescription>
                    Esta ação é irreversível. Todos os seus dados, pontos e histórico de embarcações serão apagados permanentemente.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>Cancelar</Button>
                  <Button 
                    variant="destructive" 
                    className="gap-2"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'A eliminar...' : <><Trash2 className="w-4 h-4" /> Sim, eliminar conta</>}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
