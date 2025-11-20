'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Strict type definitions
interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopping-cart';

// Validation helper
const isValidCartItem = (item: any): item is CartItem => {
  return (
    typeof item?._id === 'string' &&
    typeof item?.name === 'string' &&
    typeof item?.price === 'number' &&
    typeof item?.quantity === 'number' &&
    typeof item?.image === 'string' &&
    typeof item?.slug === 'string' &&
    item.quantity > 0 &&
    item.price >= 0
  );
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        // Validate parsed data
        if (Array.isArray(parsedCart)) {
          const validCart = parsedCart.filter(isValidCartItem);
          setCart(validCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart, isLoading]);

  // Add item to cart with proper type safety
  const addToCart = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const quantity = item.quantity ?? 1;

    // Validation
    if (!item._id || !item.name || typeof item.price !== 'number' || item.price < 0) {
      console.error('Invalid item data:', item);
      return;
    }

    if (quantity <= 0) {
      console.error('Quantity must be greater than 0');
      return;
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((i) => i._id === item._id);

      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + quantity,
        };
        return newCart;
      } else {
        // New item, add to cart
        return [
          ...prevCart,
          {
            _id: item._id,
            name: item.name,
            price: item.price,
            quantity: quantity,
            image: item.image,
            slug: item.slug,
          },
        ];
      }
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((id: string) => {
    if (!id) {
      console.error('Invalid item ID');
      return;
    }

    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (!id) {
      console.error('Invalid item ID');
      return;
    }

    if (quantity < 0) {
      console.error('Quantity cannot be negative');
      return;
    }

    if (quantity === 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Calculate total price (memoized through state)
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calculate total items (memoized through state)
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}