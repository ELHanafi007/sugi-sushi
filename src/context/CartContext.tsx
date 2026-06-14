'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Dish } from '@/data/menuData';
import { supabase } from '@/lib/supabase';

export interface CartItem {
  id: string;
  name: string;
  nameAr?: string;
  price: string;
  quantity: number;
  portion?: {
    name: string;
    pieces: number;
  };
  note?: string;
}

export interface Order {
  id: string;
  table_number: string;
  items: CartItem[];
  total_price: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  created_at: string;
  general_note?: string | null;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (dish: Dish, quantity: number, portionIdx?: number, note?: string) => void;
  removeFromCart: (itemId: string, portionName?: string) => void;
  updateItemQuantity: (itemId: string, portionName: string | undefined, quantity: number) => void;
  updateItemNote: (itemId: string, portionName: string | undefined, note: string) => void;
  clearCart: () => void;
  submitOrder: (tableNumber: string, sessionId?: string | null) => Promise<string | null>;
  buyNow: (dish: Dish, quantity: number, tableNumber: string, portionIdx?: number) => Promise<string | null>;
  activeOrders: Order[];
  cartTotal: number;
  itemCount: number;
  tableNumber: string;
  setTableNumber: (val: string) => void;
  notification: string | null;
  clearNotification: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (val: boolean) => void;
  generalNote: string;
  setGeneralNote: (val: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [tableNumber, setTableNumber] = useState('2');
  const [notification, setNotification] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [generalNote, setGeneralNote] = useState('');

  // Load cart and active order from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('sugi-cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedTable = localStorage.getItem('sugi-table-number');
    if (savedTable) setTableNumber(savedTable);

    const savedOrderIdsStr = localStorage.getItem('sugi-active-order-ids');
    if (savedOrderIdsStr) {
      try {
        const savedOrderIds = JSON.parse(savedOrderIdsStr);
        if (Array.isArray(savedOrderIds) && savedOrderIds.length > 0) {
          fetchOrders(savedOrderIds);
        }
      } catch (e) {
        console.error('Failed to parse saved order ids', e);
      }
    } else {
      // Backwards compatibility with old single order id
      const oldOrderId = localStorage.getItem('sugi-active-order-id');
      if (oldOrderId) {
        fetchOrders([oldOrderId]);
        localStorage.setItem('sugi-active-order-ids', JSON.stringify([oldOrderId]));
        localStorage.removeItem('sugi-active-order-id');
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('sugi-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sugi-table-number', tableNumber);
  }, [tableNumber]);

  const fetchOrders = async (orderIds: string[]) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .in('id', orderIds);

    if (data && !error) {
      setActiveOrders(data);
      orderIds.forEach(id => subscribeToOrder(id));
    }
  };

  const subscribeToOrder = (orderId: string) => {
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const updatedOrder = payload.new as Order;
          setActiveOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
          
          // Notify user if status changed to preparing
          if (updatedOrder.status === 'preparing') {
             setNotification('Your dish is being prepared!');
             
             if ('Notification' in window && Notification.permission === 'granted') {
               new Notification('Sugi Sushi', { body: 'Your dish is being prepared!' });
             }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const addToCart = (dish: Dish, quantity: number, portionIdx?: number, note?: string) => {
    const portion = (dish.portions && portionIdx !== undefined) ? dish.portions[portionIdx] : null;
    const price = portion ? portion.price : dish.price;
    const portionName = portion ? portion.name : undefined;

    setCart(prev => {
      const existingItemIdx = prev.findIndex(item => 
        item.id === dish.id && item.portion?.name === portionName
      );

      if (existingItemIdx > -1) {
        const nextCart = [...prev];
        nextCart[existingItemIdx].quantity += quantity;
        if (note) {
          nextCart[existingItemIdx].note = nextCart[existingItemIdx].note 
            ? nextCart[existingItemIdx].note + ', ' + note 
            : note;
        }
        return nextCart;
      }

      return [...prev, {
        id: dish.id,
        name: dish.name,
        nameAr: dish.nameAr,
        price,
        quantity,
        portion: portion ? { name: portion.name, pieces: portion.pieces } : undefined,
        note
      }];
    });
    
    // Note: automatic opening of cart drawer is now handled in StickyCartBar or CartDrawer components
  };

  const removeFromCart = (itemId: string, portionName?: string) => {
    setCart(prev => prev.filter(item => !(item.id === itemId && item.portion?.name === portionName)));
  };

  const updateItemQuantity = (itemId: string, portionName: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId, portionName);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === itemId && item.portion?.name === portionName) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const updateItemNote = (itemId: string, portionName: string | undefined, note: string) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId && item.portion?.name === portionName) {
        return { ...item, note };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setGeneralNote('');
  };

  const submitOrder = async (tableNum: string, sessionId?: string | null) => {
    if (cart.length === 0) return null;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tableId: tableNum,
          sessionId: sessionId || null,
          items: cart,
          generalNote: generalNote || null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit order via API');
      }

      const data = await response.json();
      const newOrder = data as Order;
      
      setActiveOrders(prev => {
        const next = [...prev, newOrder];
        localStorage.setItem('sugi-active-order-ids', JSON.stringify(next.map(o => o.id)));
        return next;
      });
      subscribeToOrder(newOrder.id);
      clearCart();
      setIsCartOpen(false); // Close cart on success
      return newOrder.id;

    } catch (error) {
      console.error('API order submission failed, falling back to Supabase client...', error);
      // Fallback for non-QR environments (e.g. testing)
      const total = cart.reduce((sum, item) => sum + (parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity), 0);

      const { data, error: supaError } = await supabase
        .from('orders')
        .insert({
          table_number: tableNum,
          items: cart,
          total_price: total,
          status: 'pending',
          general_note: generalNote || null,
        } as any)
        .select()
        .single();

      if (supaError) {
        console.error('Order submission error:', supaError);
        return null;
      }

      if (data) {
        const newOrder = data as Order;
        setActiveOrders(prev => {
          const next = [...prev, newOrder];
          localStorage.setItem('sugi-active-order-ids', JSON.stringify(next.map(o => o.id)));
          return next;
        });
        subscribeToOrder(newOrder.id);
        clearCart();
        setIsCartOpen(false); // Close cart on success
        return newOrder.id;
      }
    }

    return null;
  };

  const buyNow = async (dish: Dish, quantity: number, tableNum: string, portionIdx?: number) => {
    const portion = (dish.portions && portionIdx !== undefined) ? dish.portions[portionIdx] : null;
    const price = portion ? portion.price : dish.price;
    const priceNum = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    
    const item: CartItem = {
      id: dish.id,
      name: dish.name,
      nameAr: dish.nameAr,
      price,
      quantity,
      portion: portion ? { name: portion.name, pieces: portion.pieces } : undefined
    };

    const { data, error } = await supabase
      .from('orders')
      .insert({
        table_number: tableNum,
        items: [item],
        total_price: priceNum * quantity,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Instant order error:', error);
      return null;
    }

    if (data) {
      const newOrder = data as Order;
      setActiveOrders(prev => {
        const next = [...prev, newOrder];
        localStorage.setItem('sugi-active-order-ids', JSON.stringify(next.map(o => o.id)));
        return next;
      });
      subscribeToOrder(newOrder.id);
      return newOrder.id;
    }

    return null;
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      return sum + (price * item.quantity);
    }, 0);
  }, [cart]);

  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateItemQuantity,
      updateItemNote,
      clearCart,
      submitOrder,
      buyNow,
      activeOrders,
      cartTotal,
      itemCount,
      tableNumber,
      setTableNumber,
      notification,
      clearNotification: () => setNotification(null),
      isCartOpen,
      setIsCartOpen,
      generalNote,
      setGeneralNote
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
