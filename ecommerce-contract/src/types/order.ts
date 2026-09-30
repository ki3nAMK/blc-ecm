import type { IDateValue, IDatePickerControl } from './common';
import { IProductItem } from './product';

// ----------------------------------------------------------------------

export type IOrderTableFilters = {
  name: string;
  status: string;
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
};

export type IOrderHistory = {
  orderTime: IDateValue;
  paymentTime: IDateValue;
  deliveryTime: IDateValue;
  completionTime: IDateValue;
  timeline: { title: string; time: IDateValue }[];
};

export type IOrderShippingAddress = {
  fullAddress: string;
  phoneNumber: string;
};

export type IOrderPayment = {
  cardType: string;
  cardNumber: string;
};

export type IOrderDelivery = {
  shipBy: string;
  speedy: string;
  trackingNumber: string;
};

export type IOrderCustomer = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  ipAddress: string;
};

export type IOrderProductItem = {
  id: string;
  sku: string;
  name: string;
  price: number;
  coverUrl: string;
  quantity: number;
  productId: IProductItem;
  orderContractId?: string;
  // Per-unit price/escrow snapshotted at order-creation time (mirrors the on-chain
  // Order.unitPrice/unitEscrow) — checkout must use these, never the live product price,
  // so a flash sale expiring mid-checkout can't desync from what the contract expects.
  unitPrice?: number;
  unitEscrow?: number;
};

export type IOrderItem = {
  id: string;
  taxes: number;
  status: string;
  shipping: number;
  discount: number;
  subtotal: number;
  orderNumber: string;
  totalAmount: number;
  totalQuantity: number;
  createdAt: IDateValue;
  history: IOrderHistory;
  payment: IOrderPayment;
  customer: IOrderCustomer;
  delivery: IOrderDelivery;
  items: IOrderProductItem[];
  shippingAddress: IOrderShippingAddress;
};


export interface IOrderProduct {
  id: string;
  name: string;
  sku: string;
  coverUrl: string;
  price: number;
}

export interface IOrder {
  id: string;
  buyer: string;
  items: {
    productId: IOrderProduct;
    quantity: number;
    orderContractId: string;
    isVerifyBySeller: boolean;
    status: string;
  }[];
  createdAt: string;
  isCompleted: boolean;
  referrer?: { publicAddress: string } | null;
}

