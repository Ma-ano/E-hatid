import { User } from '../types';

const getMasterAdminEmail = (): string | undefined =>
  import.meta.env.VITE_MASTER_ADMIN_EMAIL as string | undefined;

export const isMasterAdmin = (user: User | null): boolean => {
  const masterEmail = getMasterAdminEmail();
  if (!masterEmail || !user?.email) return false;
  return user.email === masterEmail;
};

export const isVerifiedOrAdmin = (user: User | null): boolean => {
  if (isMasterAdmin(user)) return true;
  return user?.emailVerified === true;
};
