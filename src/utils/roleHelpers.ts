export function hasRole(activeRole: string | null, allowedRoles: string[]): boolean {
  if (!activeRole) return allowedRoles.includes('guest');
  return allowedRoles.includes(activeRole);
}

export function isAdmin(activeRole: string | null): boolean {
  return activeRole === 'admin';
}

export function isVendor(activeRole: string | null): boolean {
  return activeRole === 'vendor';
}

export function isRider(activeRole: string | null): boolean {
  return activeRole === 'rider';
}

export function isUser(activeRole: string | null): boolean {
  return activeRole === 'user';
}

export const isCustomer = isUser;
