'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CartItem, CartItemOption } from './types';

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
        setItems(prev => {
            // Check if an identical item already exists (same menuItemId and same options)
            const existingItemIndex = prev.findIndex(i => 
                i.menuItemId === item.menuItemId && 
                JSON.stringify(i.selectedOptions) === JSON.stringify(item.selectedOptions) &&
                JSON.stringify(i.exclusions) === JSON.stringify(item.exclusions)
            );

            if (existingItemIndex >= 0) {
                const newItems = [...prev];
                const existing = newItems[existingItemIndex];
                const newQuantity = existing.quantity + (item.quantity || 1);
                const optionsExtra = existing.selectedOptions.reduce((sum, o) => sum + (o.priceDelta || 0), 0);
                newItems[existingItemIndex] = {
                    ...existing,
                    quantity: newQuantity,
                    totalPrice: (existing.basePrice + optionsExtra) * newQuantity
                };
                return newItems;
            }

            const id = `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
            return [...prev, { ...item, id }];
        });
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity <= 0) {
            setItems(prev => prev.filter(item => item.id !== id));
            return;
        }
        setItems(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        quantity,
                        totalPrice:
                            (item.basePrice +
                                item.selectedOptions.reduce((sum, o) => sum + o.priceDelta, 0)) *
                            quantity,
                    }
                    : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
