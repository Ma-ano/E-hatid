import { useState, useCallback } from 'react';
import type { Order } from '../types';

const STORAGE_PREFIX = 'rider_declined_';

const getDeclinedIds = (userId: string): Set<string> => {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
    return new Set<string>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set<string>();
  }
};

const saveDeclinedIds = (userId: string, ids: Set<string>) => {
  localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify([...ids]));
};

export const useDeclinedOrders = (userId: string | undefined) => {
  const [declinedIds, setDeclinedIds] = useState<Set<string>>(() =>
    userId ? getDeclinedIds(userId) : new Set<string>()
  );

  const declineOrder = useCallback((orderId: string) => {
    if (!userId) return;
    const next = new Set(declinedIds);
    next.add(orderId);
    setDeclinedIds(next);
    saveDeclinedIds(userId, next);
  }, [userId, declinedIds]);

  const filterDeclined = useCallback((orders: Order[]): Order[] => {
    return orders.filter(o => !declinedIds.has(o.id));
  }, [declinedIds]);

  return { declineOrder, filterDeclined, declinedCount: declinedIds.size };
};
