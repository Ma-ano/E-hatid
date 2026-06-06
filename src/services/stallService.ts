import { db } from '../firebaseConfig';
import { collection, getDocs, getDoc, doc, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { Stall, MenuItem } from '../types/index';

const CATEGORIES = ['All', 'Fast Food', 'Italian', 'Japanese', 'Mexican', 'Chinese', 'Indian', 'Desserts', 'Drinks'];

export const fetchStalls = async (filters?: {
  category?: string;
  search?: string;
}): Promise<Stall[]> => {
  try {
    let q = filters?.category && filters.category !== 'All'
      ? query(collection(db, 'stalls'), where('category', '==', filters.category))
      : collection(db, 'stalls');
    const snapshot = await getDocs(q);
    let stalls = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Stall));
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      stalls = stalls.filter(stall =>
        stall.name.toLowerCase().includes(s) ||
        stall.description?.toLowerCase().includes(s) ||
        stall.category?.toLowerCase().includes(s)
      );
    }
    return stalls.filter(s => s.active !== false);
  } catch (err) {
    console.error('Error fetching stalls:', err);
    return [];
  }
};

export const getCategories = (): string[] => {
  return CATEGORIES;
};

export const fetchStallById = async (id: string): Promise<Stall | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'stalls', id));
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() } as Stall;
    return null;
  } catch (err) {
    console.error('Error fetching stall:', err);
    return null;
  }
};

export const createStall = async (stall: Stall): Promise<void> => {
  await setDoc(doc(db, 'stalls', stall.id), stall);
};

export const updateStall = async (id: string, data: Partial<Stall>): Promise<void> => {
  await updateDoc(doc(db, 'stalls', id), data);
};

export const updateStallMenu = async (stallId: string, menu: MenuItem[]): Promise<void> => {
  await updateDoc(doc(db, 'stalls', stallId), { menu });
};

export const getStallByVendorId = async (vendorId: string): Promise<Stall | null> => {
  try {
    const q = query(collection(db, 'stalls'), where('vendorId', '==', vendorId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const d = snapshot.docs[0];
    return { id: d.id, ...d.data() } as Stall;
  } catch (err) {
    console.error('Error fetching stall by vendor:', err);
    return null;
  }
};
