import type { IShop } from "@/types/shop";

import { isNil } from "lodash";

import { http } from "../baseRequest";

export interface IShopListResponse {
    data: IShop[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const shopService = {
    getList: (page?: number, limit?: number): Promise<IShopListResponse> =>
        http.axios.request({
            method: 'GET',
            url: `/shops?page=${isNil(page) ? 1 : page}&limit=${isNil(limit) ? 20 : limit}`,
        }),

    getTopShops: (limit?: number): Promise<IShop[]> =>
        http.axios.request({
            method: 'GET',
            url: `/shops/top?limit=${isNil(limit) ? 4 : limit}`,
        }),

    getDetail: (id: string): Promise<IShop> =>
        http.axios.request({
            method: 'GET',
            url: `/shops/${id}`,
        }),

    updateMyShop: (payload: { shopBanner?: string; shopDescription?: string }): Promise<IShop> =>
        http.axios.request({
            method: 'PATCH',
            url: `/users/me/shop`,
            data: payload,
        }),
};

export default shopService;
