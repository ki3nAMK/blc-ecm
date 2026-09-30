import type { IProductItem, IProductReview } from "@/types/product";

import { isNil } from "lodash";

import { http } from "../baseRequest";

export interface ISetFlashSalePayload {
    discountedPrice: number;
    discountedEscrow: number;
    startTime: string;
    endTime: string;
    txHash: string;
}

export interface ICreateProductPayload {
    name: string;
    description: string;
    subDescription?: string;
    code: string;
    sku: string;
    category: string;
    gender: string[];
    colors: string[];
    sizes: string[];
    tags: string[];
    images: string[];
    price: number;
    escrow: number;
    priceSale?: number;
    taxes?: number;
    quantity: number;
    newLabel?: { enabled: boolean; content: string };
    saleLabel?: { enabled: boolean; content: string };
}

const productService = {
    getList: (page?: number, limit?: number): Promise<IProductItem[]> =>
        http.axios.request({
            method: 'GET',
            url: `/products?page=${isNil(page) ? 1 : page}&limit=${isNil(limit) ? 100 : limit}`
        }),

    getMyProducts: (page?: number, limit?: number): Promise<any> =>
        http.axios.request({
            method: 'GET',
            url: `/products/me?page=${isNil(page) ? 1 : page}&limit=${isNil(limit) ? 100 : limit}`
        }),

    getBySeller: (sellerId: string, page?: number, limit?: number): Promise<any> =>
        http.axios.request({
            method: 'GET',
            url: `/products/seller/${sellerId}?page=${isNil(page) ? 1 : page}&limit=${isNil(limit) ? 100 : limit}`
        }),

    getByCategory: (category: string, page?: number, limit?: number): Promise<any> =>
        http.axios.request({
            method: 'GET',
            url: `/products/category/${encodeURIComponent(category)}?page=${isNil(page) ? 1 : page}&limit=${isNil(limit) ? 100 : limit}`
        }),

    getDetail: (id: string): Promise<IProductItem> =>
        http.axios.request({
            method: 'GET',
            url: `/products/${id}`
        }),

    create: (payload: ICreateProductPayload): Promise<IProductItem> =>
        http.axios.request({
            method: 'POST',
            url: `/products`,
            data: payload,
        }),

    uploadImage: (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('file', file);

        return http.axios.request({
            method: 'POST',
            url: `/products/upload-image`,
            data: formData,
            headers: { 'Content-Type': undefined },
        });
    },

    publishProduct: (id: string): Promise<IProductItem> =>
        http.axios.request({
            method: 'PATCH',
            url: `/products/${id}/publish`,
        }),

    createReview: (productId: string, payload: { rating: number; comment: string }): Promise<IProductReview> =>
        http.axios.request({
            method: 'POST',
            url: `/products/${productId}/reviews`,
            data: payload,
        }),

    setFlashSale: (id: string, payload: ISetFlashSalePayload): Promise<IProductItem> =>
        http.axios.request({
            method: 'PATCH',
            url: `/products/${id}/flash-sale`,
            data: payload,
        }),

    cancelFlashSale: (id: string): Promise<IProductItem> =>
        http.axios.request({
            method: 'DELETE',
            url: `/products/${id}/flash-sale`,
        }),
};

export default productService;
