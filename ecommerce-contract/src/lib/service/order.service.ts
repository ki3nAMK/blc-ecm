import { IOrder } from "@/types/order";
import { http } from "../baseRequest";

export interface IOrderItem {
    productId: string;
    quantity: number;
    orderContractId: string;
}

export interface IOrderListResponse {
    items: IOrder[];
    count: number;
}

export interface ICreateOrderItem {
    productId: string;
    quantity: number;
}

export interface ICreateOrderPayload {
    items: ICreateOrderItem[];
    referralCode?: string;
}

export interface IUpdateItemStatusPayload {
    productId: string;
    status?: string;
    isVerifyBySeller?: boolean;
}


const orderService = {
    createOrder: (payload: ICreateOrderPayload): Promise<IOrder> =>
        http.axios.request({
            method: "POST",
            url: `/orders`,
            data: payload,
        }),

    getOrdersByBuyer: (): Promise<IOrderListResponse> =>
        http.axios.request({
            method: "GET",
            url: `/orders/buyer`,
        }),

    getOrdersBySeller: (): Promise<IOrderListResponse> =>
        http.axios.request({
            method: "GET",
            url: `/orders/seller`,
        }),

    getOrdersByReferrer: (): Promise<IOrderListResponse> =>
        http.axios.request({
            method: "GET",
            url: `/orders/referrer`,
        }),

    getOrdersDetail: (id: string): Promise<IOrder> =>
        http.axios.request({
            method: "GET",
            url: `/orders/${id}`,
        }),

    updateItemStatus: (id: string, payload: IUpdateItemStatusPayload): Promise<IOrder> =>
        http.axios.request({
            method: "PATCH",
            url: `/orders/${id}/item-status`,
            data: payload,
        }),

};

export default orderService;
