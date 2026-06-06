import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Order } from '../types';
import { User } from '../types';
import { useAuth } from './AuthContext';

const ORDERS_BASE_KEY = 'user_orders';

function getOrdersKey(user: User | null, isGuest: boolean): string {
  if (isGuest) return `${ORDERS_BASE_KEY}_guest`;
  if (user?.id) return `${ORDERS_BASE_KEY}_${user.role}_${user.id}`;
  return `${ORDERS_BASE_KEY}_temp`;
}

const loadOrders = (key: string): Order[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveOrders = (key: string, orders: Order[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(orders));
  } catch {
    // Storage full or blocked
  }
};

interface OrderContextType {
  orders: Order[];
  activeOrders: Order[];
  activeOrderCount: number;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ACTIVE_STATUSES: Order['status'][] = ['pending', 'accepted', 'preparing', 'ready'];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const ordersKey = getOrdersKey(user, isGuest);
  const [orders, setOrders] = useState<Order[]>([]);
  const prevKeyRef = useRef(ordersKey);

  useEffect(() => {
    if (prevKeyRef.current !== ordersKey) {
      prevKeyRef.current = ordersKey;
      setOrders(loadOrders(ordersKey));
    }
  }, [ordersKey]);

  useEffect(() => {
    saveOrders(ordersKey, orders);
  }, [ordersKey, orders]);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => {
      const exists = prev.find(o => o.id === order.id);
      if (exists) return prev;
      return [order, ...prev];
    });
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status } : o)
    );
  }, []);

  const activeOrders = orders.filter(o => ACTIVE_STATUSES.includes(o.status));
  const activeOrderCount = activeOrders.length;

  return (
    <OrderContext.Provider value={{ orders, activeOrders, activeOrderCount, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};
