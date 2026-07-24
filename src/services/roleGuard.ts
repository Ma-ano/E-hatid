import { User } from '../types';
import { isVerifiedOrAdmin } from '../utils/isVerifiedOrAdmin';

export function getRoleRedirect(user: User, role: string): string | null {
  if (role === 'customer') {
    if (!isVerifiedOrAdmin(user)) return '/verify-otp';
    return '/customer/home';
  }

  if (role === 'admin') return '/admin/dashboard';

  const status = user.roleStatus?.[role];
  if (role === 'vendor') {
    if (status === 'pending') return '/approval-pending?role=vendor';
    if (status === 'rejected') return '/application-rejected?role=vendor';
    if (status === 'approved') return '/vendor/dashboard';
    return '/apply/vendor';
  }

  if (role === 'rider') {
    if (status === 'pending') return '/approval-pending?role=rider';
    if (status === 'rejected') return '/application-rejected?role=rider';
    if (status === 'approved') return '/rider/dashboard';
    return '/apply/rider';
  }

  return null;
}
