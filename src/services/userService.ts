import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { User } from '../types';

export const createUserDocument = async (uid: string, data: Partial<User>) => {
  const role = data.role || 'customer';

  const userData = {
    id: uid,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    age: typeof data.age === 'number' ? data.age : 0,
    address: data.address || '',
    role,
    roles: data.roles || [role],
    activeRole: data.activeRole || data.roles?.[0] || role,
    roleStatus: data.roleStatus || {},
    emailVerified: data.emailVerified === true,
    created_at: serverTimestamp(),
  };
  if (data.stallName) (userData as any).stallName = data.stallName;
  if (data.stallAddress) (userData as any).stallAddress = data.stallAddress;

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
    const data = docSnap.data() as any;
    if (!data.roleStatus) {
      data.roleStatus = {};
    }
    const legacyStatus = data.accountStatus as string | undefined;
    if (legacyStatus && legacyStatus !== 'active') {
      data.roleStatus[data.role || 'customer'] = legacyStatus === 'pending' ? 'pending' : 'rejected';
    }
    data.roles = data.roles || [data.role || 'customer'];
    data.activeRole = data.activeRole || (data.role === 'admin' ? 'admin' : 'customer');
    return data as User;
  }
  return null;
};

export const updateUserDocument = async (uid: string, data: Partial<User>) => {
  await updateDoc(doc(db, 'users', uid), data as any);
};

export const setRoleStatus = async (uid: string, role: string, status: 'approved' | 'rejected') => {
  await updateDoc(doc(db, 'users', uid), {
    [`roleStatus.${role}`]: status,
  });
};

export const updateUserRole = async (uid: string, newRole: User['role']) => {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) throw new Error('User not found');
  const current = snap.data();
  const currentRoles: string[] = current.roles || [current.role];
  if (currentRoles.includes(newRole)) return;
  const updatedRoles = [...currentRoles, newRole];
  const roleStatus = { ...(current.roleStatus || {}), [newRole]: newRole === 'admin' ? 'approved' : 'pending' };
  await updateDoc(doc(db, 'users', uid), {
    role: newRole,
    roles: updatedRoles,
    activeRole: newRole,
    roleStatus,
  });
};

export const saveRoleProfile = async (uid: string, role: string, data: Record<string, any>) => {
  await setDoc(doc(db, 'users', uid, `${role}Profile`, 'data'), { ...data, status: 'pending', submittedAt: serverTimestamp() });
};

export const getRoleProfile = async (uid: string, role: string): Promise<any | null> => {
  try {
    const snap = await getDoc(doc(db, 'users', uid, `${role}Profile`, 'data'));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
};

export const updateRoleProfile = async (uid: string, role: string, data: any) => {
  await setDoc(doc(db, 'users', uid, `${role}Profile`, 'data'), data, { merge: true });
};

export const fetchAllUsers = async (): Promise<User[]> => {
  const { getDocs, collection } = await import('firebase/firestore');
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => {
    const data = d.data() as any;
    if (!data.roleStatus) {
      data.roleStatus = {};
    }
    const legacyStatus = data.accountStatus as string | undefined;
    if (legacyStatus && legacyStatus !== 'active') {
      data.roleStatus[data.role || 'customer'] = legacyStatus === 'pending' ? 'pending' : 'rejected';
    }
    data.roles = data.roles || [data.role || 'customer'];
    data.activeRole = data.activeRole || (data.role === 'admin' ? 'admin' : 'customer');
    return data as User;
  });
};

export const submitApplicationDoc = async (userId: string, role: string, data: Record<string, any>) => {
  const { collection, addDoc } = await import('firebase/firestore');
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined && v !== null)
  );
  return addDoc(collection(db, 'applications'), {
    userId,
    role,
    status: 'pending',
    createdAt: serverTimestamp(),
    ...cleanData,
  });
};

export const fetchPendingApprovals = async (): Promise<User[]> => {
  const all = await fetchAllUsers();
  return all.filter(u =>
    Object.values(u.roleStatus || {}).some(s => s === 'pending')
  );
};
