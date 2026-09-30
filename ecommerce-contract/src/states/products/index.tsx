'use client';

import type { ReactNode } from 'react';
import type { IProductItem } from '@/types/product';

import { isNil } from 'lodash';
import { useMutation, useQuery } from '@tanstack/react-query';

import productService, { ICreateProductPayload } from '@/lib/service/product.service';
import orderService, { ICreateOrderPayload } from '@/lib/service/order.service';

import {
    useMemo,
    useState,
    useContext,
    createContext,
} from 'react';
import { useAuthContext } from '@/auth/hooks';
import { IOrder } from '@/types/order';

interface IProductOrderContext {
    // ✅ PRODUCT LIST
    products: IProductItem[];
    loading: boolean;

    // ✅ PRODUCT DETAIL
    product: IProductItem | null;
    productLoading: boolean;
    productError: unknown;

    // ✅ ORDER LIST
    orders: IOrder[];
    orderCount: number;
    orderLoading: boolean;

    // ✅ CREATE ORDER
    createOrder: (
        payload: ICreateOrderPayload,
        options?: {
            onSuccess?: () => void;
            onError?: (error: unknown) => void;
        }
    ) => Promise<void>;

    creatingOrder: boolean;

    // ✅ CREATE PRODUCT
    createProduct: (
        payload: ICreateProductPayload,
        options?: {
            onSuccess?: (product: any) => void;
            onError?: (error: unknown) => void;
        }
    ) => Promise<void>;

    creatingProduct: boolean;


    // ✅ CONTROL
    currentProductId: string | null;
    setCurrentProductId: (id: string | null) => void;

    buyerId: string | null;
    setBuyerId: (id: string | null) => void;

    refetchList: () => void;
    refetchProduct: () => void;
    refetchOrders: () => void;
}

const ProductOrderContext = createContext<IProductOrderContext | null>(null);

export const ProductProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [currentProductId, setCurrentProductId] = useState<string | null>(null);
    const [buyerId, setBuyerId] = useState<string | null>(null);
    const { authenticated, user, loading: loadingAuth } = useAuthContext()

    /* ===================== ✅ PRODUCT LIST ===================== */
    const {
        data: products = [],
        isLoading: loading,
        refetch: refetchList,
    } = useQuery({
        queryKey: ['products'],
        queryFn: async () => productService.getList(),
        staleTime: 1000 * 60 * 5,
    });

    /* ===================== ✅ PRODUCT DETAIL ===================== */
    const {
        data: product = null,
        isLoading: productLoading,
        error: productError,
        refetch: refetchProduct,
    } = useQuery({
        queryKey: ['product-detail', currentProductId],
        enabled: !!currentProductId,
        queryFn: async () => {
            if (!currentProductId) return null;
            return productService.getDetail(currentProductId);
        },
    });

    /* ===================== ✅ ORDER LIST ===================== */
    const {
        data: orderResp,
        isLoading: orderLoading,
        refetch: refetchOrders,
    } = useQuery({
        queryKey: ['orders', user?.role, authenticated],
        enabled: authenticated && !loadingAuth,
        queryFn: async () => {
            if (user?.role === 'SELLER') {
                return orderService.getOrdersBySeller();
            }
            return orderService.getOrdersByBuyer();
        },
        staleTime: 1000 * 60 * 5,
    });

    const createOrder = async (
        payload: ICreateOrderPayload,
        options?: {
            onSuccess?: () => void;
            onError?: (error: unknown) => void;
        }
    ) => {
        try {
            await _createOrder(payload);
            await refetchOrders();

            options?.onSuccess?.();
        } catch (error) {
            options?.onError?.(error);
        }
    };


    const {
        mutateAsync: _createOrder,
        isPending: creatingOrder,
    } = useMutation({
        mutationFn: async (payload: ICreateOrderPayload) => {
            return orderService.createOrder(payload);
        },
    });

    const createProduct = async (
        payload: ICreateProductPayload,
        options?: {
            onSuccess?: (product: any) => void;
            onError?: (error: unknown) => void;
        }
    ) => {
        try {
            const product = await _createProduct(payload);
            await refetchList();
            options?.onSuccess?.(product);
        } catch (error) {
            options?.onError?.(error);
        }
    };

    const {
        mutateAsync: _createProduct,
        isPending: creatingProduct,
    } = useMutation({
        mutationFn: async (payload: ICreateProductPayload) => {
            return productService.create(payload);
        },
    });


    const value = useMemo(
        () => ({
            // ✅ PRODUCTS
            products,
            loading,

            // ✅ PRODUCT DETAIL
            product,
            productLoading,
            productError,

            // ✅ ORDERS
            orders: orderResp?.items ?? [],
            orderCount: orderResp?.count ?? 0,
            orderLoading,

            // ✅ CREATE ORDER
            createOrder,
            creatingOrder,

            // ✅ CREATE PRODUCT
            createProduct,
            creatingProduct,

            // ✅ CONTROL
            currentProductId,
            setCurrentProductId,

            buyerId,
            setBuyerId,

            refetchList,
            refetchProduct,
            refetchOrders,
        }),
        [
            products,
            loading,
            product,
            productLoading,
            productError,
            orderResp,
            orderLoading,
            currentProductId,
            buyerId,
            refetchList,
            refetchProduct,
            refetchOrders,
            createOrder,
            creatingOrder,
            createProduct,
            creatingProduct,
        ],
    );

    return (
        <ProductOrderContext.Provider value={value as any}>
            {children}
        </ProductOrderContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductOrderContext);
    if (isNil(context)) {
        throw new Error(
            'useProductOrders must be used within a ProductOrderProvider',
        );
    }
    return context;
};
