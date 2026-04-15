import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { services as staticServices, packs as staticPacks, boatSizeCategories } from '@/data/services';

export function useLiveContent() {
  const [services, setServices] = useState<any[]>(staticServices);
  const [packs, setPacks] = useState<any[]>(staticPacks);
  const [boatSizes, setBoatSizes] = useState<any[]>(boatSizeCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubServices = onSnapshot(collection(db, 'services'), (snap) => {
      if (!snap.empty) {
        const srvs: any[] = [];
        snap.forEach(doc => srvs.push({ ...doc.data(), id: doc.id }));
        setServices(srvs);
      }
      setLoading(false);
    });

    const unsubPacks = onSnapshot(collection(db, 'packs'), (snap) => {
      if (!snap.empty) {
        const pcks: any[] = [];
        snap.forEach(doc => pcks.push({ ...doc.data(), id: doc.id }));
        setPacks(pcks);
      }
    });

    const unsubBoatSizes = onSnapshot(collection(db, 'boat_sizes'), (snap) => {
      if (!snap.empty) {
        const sizes: any[] = [];
        snap.forEach(doc => sizes.push({ ...doc.data(), id: doc.id }));
        setBoatSizes(sizes);
      }
    });

    return () => {
      unsubServices();
      unsubPacks();
      unsubBoatSizes();
    };
  }, []);

  return { services, packs, boatSizes, loading };
}
