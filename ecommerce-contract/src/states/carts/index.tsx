'use client';

import type {
    ReactNode} from 'react';
import type { IProductItem } from '@/types/product';

import { isNil } from 'lodash';
import {
    useMemo,
    useState,
    useContext,
    createContext
} from 'react';

/* ===================== ✅ TYPE ===================== */
export type ICartItem = IProductItem & {
    quantity: number;
};

interface ICartContext {
    cartItems: ICartItem[];
    cartCount: number;

    addToCart: (product: IProductItem, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;

    increaseQty: (productId: string) => void;
    decreaseQty: (productId: string) => void;
}

const cartContext = createContext<ICartContext | null>(null);

/* ===================== ✅ PROVIDER ===================== */
export const CartProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [cartItems, setCartItems] = useState<ICartItem[]>([]);

    /* ===== ADD ===== */
    const addToCart = (product: IProductItem, quantity = 1) => {
        setCartItems((prev) => {
            const found = prev.find((item) => item.id === product.id);
            console.log(found)

            if (found) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity > found.available ? item.quantity : item.quantity + quantity }
                        : item,
                );
            }

            return [...prev, { ...product, quantity }];
        });
    };

    /* ===== REMOVE ===== */
    const removeFromCart = (productId: string) => {
        setCartItems((prev) =>
            prev.filter((item) => item.id !== productId),
        );
    };

    /* ===== CLEAR ===== */
    const clearCart = () => {
        setCartItems([]);
    };

    /* ===== QTY + ===== */
    const increaseQty = (productId: string) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === productId
                    ? { ...item, quantity: item.quantity >= item.available ? item.quantity : item.quantity + 1 }
                    : item,
            ),
        );
    };

    /* ===== QTY - ===== */
    const decreaseQty = (productId: string) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item,
                )
                .filter((item) => item.quantity > 0),
        );
    };

    const cartCount = useMemo(
        () =>
            cartItems.reduce(
                (total, item) => total + item.quantity,
                0,
            ),
        [cartItems],
    );

    const value = useMemo(
        () => ({
            cartItems,
            cartCount,
            addToCart,
            removeFromCart,
            clearCart,
            increaseQty,
            decreaseQty,
        }),
        [cartItems, cartCount],
    );

    return (
        <cartContext.Provider value={value}>
            {children}
        </cartContext.Provider>
    );
};

/* ===================== ✅ HOOK ===================== */
export const useCart = () => {
    const context = useContext(cartContext);

    if (isNil(context)) {
        throw new Error(
            'useCart must be used within a CartProvider',
        );
    }

    return context;
};
