import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

const ITEMS = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  sku: `16H9UR${index}`,
  quantity: index + 1,
  name: _mock.productName(index),
  coverUrl: _mock.image.product(index),
  price: _mock.number.price(index),
}));

export const _orders = [...Array(20)].map((_, index) => {
  const shipping = 10;

  const discount = 10;

  const taxes = 10;

  const items = (index % 2 && ITEMS.slice(0, 1)) || (index % 3 && ITEMS.slice(1, 3)) || ITEMS;

  const totalQuantity = items.reduce((accumulator, item) => accumulator + item.quantity, 0);

  const subtotal = items.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);

  const totalAmount = subtotal - shipping - discount + taxes;

  const customer = {
    id: _mock.id(index),
    name: _mock.fullName(index),
    email: _mock.email(index),
    avatarUrl: _mock.image.avatar(index),
    ipAddress: '192.158.1.38',
  };

  const delivery = { shipBy: 'DHL', speedy: 'Standard', trackingNumber: 'SPX037739199373' };

  const history = {
    orderTime: _mock.time(1),
    paymentTime: _mock.time(2),
    deliveryTime: _mock.time(3),
    completionTime: _mock.time(4),
    timeline: [
      { title: 'Delivery successful', time: _mock.time(1) },
      { title: 'Transporting to [2]', time: _mock.time(2) },
      { title: 'Transporting to [1]', time: _mock.time(3) },
      { title: 'The shipping unit has picked up the goods', time: _mock.time(4) },
      { title: 'Order has been created', time: _mock.time(5) },
    ],
  };

  return {
    id: _mock.id(index),
    orderNumber: `#601${index}`,
    createdAt: _mock.time(index),
    taxes,
    items,
    history,
    subtotal,
    shipping,
    discount,
    customer,
    delivery,
    totalAmount,
    totalQuantity,
    shippingAddress: {
      fullAddress: '19034 Verna Unions Apt. 164 - Honolulu, RI / 87535',
      phoneNumber: '365-374-4961',
    },
    payment: { cardType: 'mastercard', cardNumber: '**** **** **** 5678' },
    status:
      (index % 2 && 'completed') ||
      (index % 3 && 'pending') ||
      (index % 4 && 'cancelled') ||
      'refunded',
  };
});

const MOCK_EXTRA = {
  taxes: 10,
  shipping: 10,
  discount: 0,
  customer: {
    id: _mock.id(1),
    name: _mock.fullName(1),
    email: _mock.email(1),
    avatarUrl: _mock.image.avatar(1),
    ipAddress: '192.158.1.38',
  },
  delivery: {
    shipBy: 'GHN',
    speedy: 'Standard',
    trackingNumber: 'SPX-' + _mock.id(3).slice(0, 8),
  },
  history: {
    orderTime: _mock.time(1),
    paymentTime: _mock.time(2),
    deliveryTime: _mock.time(3),
    completionTime: _mock.time(4),
    timeline: [
      { title: 'Order created', time: _mock.time(5) },
      { title: 'Seller accepted order', time: _mock.time(4) },
      { title: 'Shipping unit picked up goods', time: _mock.time(3) },
      { title: 'Delivering…', time: _mock.time(2) },
      { title: 'Delivered successfully', time: _mock.time(1) },
    ],
  },
  shippingAddress: {
    fullAddress: '19034 Verna Unions Apt 164',
    phoneNumber: '0123456789',
  },
  payment: { cardType: 'mastercard', cardNumber: '**** **** **** 5678' },
};

// Tính toán subtotal, totalQuantity
const calculateTotals = (items: any[]) => {
  const totalQuantity = items.reduce((acc, c) => acc + c.quantity, 0);

  const subtotal = items.reduce((acc, c) => acc + (c.price ?? 10) * c.quantity, 0);
  // price chưa có → tạm mock price = 10
  return { subtotal, totalQuantity };
};

export function normalizeOrder(apiOrder: any) {
  console.log("normalizeOrder: apiOrder =", apiOrder);
  const { subtotal, totalQuantity } = calculateTotals(apiOrder.items);

  const totalAmount = subtotal + MOCK_EXTRA.taxes + MOCK_EXTRA.shipping - MOCK_EXTRA.discount;

  const customer = apiOrder.buyer && typeof apiOrder.buyer === 'object' ? {
    id: apiOrder.buyer._id || apiOrder.buyer.id,
    name: apiOrder.buyer.name || 'Anonymous Buyer',
    email: apiOrder.buyer.email || 'buyer@example.com',
    avatarUrl: apiOrder.buyer.avatar || apiOrder.buyer.avatarUrl || MOCK_EXTRA.customer.avatarUrl,
    ipAddress: '192.158.1.38',
  } : MOCK_EXTRA.customer;

  const statuses = (apiOrder.items || []).map((item: any) => item.status);
  let status = 'pending';
  if (statuses.length > 0) {
    if (statuses.every((s: any) => s === 'DONE')) {
      status = 'completed';
    } else if (statuses.every((s: any) => s === 'CANCLED')) {
      status = 'cancelled';
    } else if (statuses.every((s: any) => s === 'ON_WAITING_REFUND')) {
      status = 'refunded';
    }
  }

  return {
    ...apiOrder,
    status,
    orderNumber: '#' + apiOrder.id.slice(-6),
    subtotal,
    totalQuantity,
    totalAmount,
    ...MOCK_EXTRA,
    customer,
  };
}
