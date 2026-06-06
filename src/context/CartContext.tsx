// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { CartItem, MenuItem, SelectedOption, SelectedAddOn } from '../types';
import { User } from '../types';
import { useAuth } from './AuthContext';

const CART_BASE_KEY = 'foodie_cart';

function getCartKey(user: User | null, isGuest: boolean): string {
  if (isGuest) return `${CART_BASE_KEY}_guest`;
  if (user?.id) return `${CART_BASE_KEY}_${user.role}_${user.id}`;
  return `${CART_BASE_KEY}_temp`;
}

const loadCart = (key: string): CartItem[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCart = (key: string, items: CartItem[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Storage full or blocked
  }
};

function generateCartItemId(item: MenuItem, options?: SelectedOption[], addOns?: SelectedAddOn[]): string {
  const optionStr = options
    ?.map(o => `${o.optionId}:${o.choiceId}`)
    .sort()
    .join('|') || '';
  const addOnStr = addOns
    ?.map(a => a.addOnId)
    .sort()
    .join('|') || '';
  return `${item.id}__${optionStr}__${addOnStr}`;
}

function computeItemPrice(item: MenuItem, options?: SelectedOption[], addOns?: SelectedAddOn[]): number {
  let total = item.price;
  if (options) {
    total += options.reduce((sum, o) => sum + o.choicePrice, 0);
  }
  if (addOns) {
    total += addOns.reduce((sum, a) => sum + a.price, 0);
  }
  return total;
}

export interface AddToCartInput {
  item: MenuItem;
  selectedOptions?: SelectedOption[];
  selectedAddOns?: SelectedAddOn[];
  specialInstructions?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (input: AddToCartInput) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const cartKey = getCartKey(user, isGuest);
  const [items, setItems] = useState<CartItem[]>([]);
  const prevKeyRef = useRef(cartKey);

  useEffect(() => {
    if (prevKeyRef.current !== cartKey) {
      prevKeyRef.current = cartKey;
      setItems(loadCart(cartKey));
    }
  }, [cartKey]);

  const addToCart = useCallback((input: AddToCartInput) => {
    const { item, selectedOptions, selectedAddOns, specialInstructions } = input;
    const cartId = generateCartItemId(item, selectedOptions, selectedAddOns);
    const unitPrice = computeItemPrice(item, selectedOptions, selectedAddOns);

    setItems(prev => {
      const existing = prev.find(i => i.id === cartId);
      if (existing) {
        return prev.map(i =>
          i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, {
        id: cartId,
        menuItemId: item.id,
        stallId: item.stallId,
        name: item.name,
        price: unitPrice,
        quantity: 1,
        image: item.image,
        selectedOptions,
        selectedAddOns,
        specialInstructions,
      }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems(prev =>
      prev.map(i => i.id === itemId ? { ...i, quantity } : i)
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    saveCart(cartKey, []);
  }, [cartKey]);

  useEffect(() => {
    saveCart(cartKey, items);
  }, [cartKey, items]);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};