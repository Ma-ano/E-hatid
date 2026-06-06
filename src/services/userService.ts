// src/services/userService.ts
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { User } from '../types';

export const createUserDocument = async (uid: string, data: Partial<User>) => {
  const userData = {
    id: uid,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    age: typeof data.age === 'number' ? data.age : 0,
    address: data.address || '',
    role: data.role || 'user',
    stallName: data.stallName || '',
    stallAddress: data.stallAddress || '',
    created_at: serverTimestamp(),
  };
  try {
    await setDoc(doc(db, 'users', uid), userData);
  } catch (error) {
    console.error('Firestore createUserDocument failed:', error);
    throw error;
  }
  return userData;
};

export const getUserDocument = async (uid: string): Promise<User | null> => {
  const docSnap = await getDoc(doc(db, 'users', uid));
  if (docSnap.exists()) {
    return docSnap.data() as User;
  }
  return null;
};

export const updateUserDocument = async (uid: string, data: Partial<User>) => {
  await updateDoc(doc(db, 'users', uid), data);
};