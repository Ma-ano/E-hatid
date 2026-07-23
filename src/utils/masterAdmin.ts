import { getUserDocument, createUserDocument, updateUserDocument, updateUserRole } from '../services/userService';

const MASTER_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;

export async function syncMasterAdminRole(uid: string, email: string): Promise<void> {
  if (!MASTER_EMAIL || email !== MASTER_EMAIL) return;

  let userData = await getUserDocument(uid);
  if (!userData) {
    await createUserDocument(uid, {
      email,
      name: 'Master Admin',
      role: 'admin',
      roles: ['admin'],
      activeRole: 'admin',
      accountStatus: 'active',
    });
    return;
  }
  if (userData.accountStatus !== 'active') {
    await updateUserDocument(uid, { accountStatus: 'active' });
  }
  if (!userData.roles.includes('admin')) {
    await updateUserRole(uid, 'admin');
    await updateUserDocument(uid, { accountStatus: 'active' });
  }
}
