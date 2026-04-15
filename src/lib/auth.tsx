import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  User,
  signOut
} from 'firebase/auth';
import { app, db } from './firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    const updatePresence = async () => {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          lastSeen: serverTimestamp(),
          isOnline: true
        });
      } catch (err) {
        console.error("Presence error:", err);
      }
    };

    updatePresence();
    const interval = setInterval(updatePresence, 1000 * 60 * 5); // Every 5 mins

    return () => {
      clearInterval(interval);
      // Optional: Set offline on unmount, but better to rely on lastSeen logic in admin
    };
  }, [user]);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
