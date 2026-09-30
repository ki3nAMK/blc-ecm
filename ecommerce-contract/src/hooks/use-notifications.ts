import type { NotificationItemProps } from 'src/layouts/components/notifications-drawer/notification-item';

import { useMemo } from 'react';
import { formatEther } from 'ethers';
import { useQuery } from '@tanstack/react-query';

import { useAuthContext } from '@/auth/hooks';
import orderService from '@/lib/service/order.service';
import airdropService from '@/lib/service/airdrop.service';

import { fEth } from 'src/utils/format-number';

// ----------------------------------------------------------------------

const COMMISSION_RATE = 0.02;

const STATUS_LABEL: Record<string, string> = {
  NONE: 'vừa được tạo',
  DEPOSIT_ESCROW: 'đã đặt cọc',
  FULLY_DEPOSITED: 'đã thanh toán đủ',
  CANCLED: 'đã bị hủy',
  ON_WAITING_REFUND: 'đang chờ hoàn tiền',
  SELLER_FINALIZED: 'đã được người bán xác nhận',
  ORDER_RECEIVED: 'đã được xác nhận nhận hàng',
  DONE: 'đã hoàn tất',
};

const UNREAD_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

function isRecent(dateStr?: string | null) {
  if (!dateStr) return false;
  const time = new Date(dateStr).getTime();
  return Number.isFinite(time) && Date.now() - time < UNREAD_WINDOW_MS;
}

// Derives the notification list from data the app already fetches elsewhere (orders,
// referred commissions, available airdrops) instead of a dedicated notifications backend —
// there's no persisted "seen" flag, so isUnRead is approximated from recency.
export function useNotifications(): NotificationItemProps[] {
  const { user } = useAuthContext();
  const role = user?.role;

  const { data: sellerOrders } = useQuery({
    queryKey: ['notifications-orders-seller'],
    enabled: role === 'SELLER',
    queryFn: () => orderService.getOrdersBySeller(),
  });

  const { data: referrerOrders } = useQuery({
    queryKey: ['notifications-orders-referrer'],
    enabled: role === 'AFFILIATE',
    queryFn: () => orderService.getOrdersByReferrer(),
  });

  const { data: airdrops } = useQuery({
    queryKey: ['notifications-airdrops'],
    enabled: role === 'AFFILIATE',
    queryFn: () => airdropService.getMyAirdrops(),
  });

  const { data: buyerOrders } = useQuery({
    queryKey: ['notifications-orders-buyer'],
    enabled: role !== 'SELLER' && role !== 'AFFILIATE',
    queryFn: () => orderService.getOrdersByBuyer(),
  });

  return useMemo(() => {
    const items: NotificationItemProps[] = [];

    if (role === 'SELLER') {
      (sellerOrders?.items ?? []).forEach((order) => {
        order.items.forEach((item, index) => {
          if (!item.status || item.status === 'NONE') return;
          const productName = item.productId?.name || 'sản phẩm';
          const title =
            item.status === 'DONE'
              ? `<p>Đơn hàng <strong>${productName}</strong> đã hoàn tất, bạn đã nhận thanh toán</p>`
              : `<p>Đơn hàng <strong>${productName}</strong> (x${item.quantity}) ${STATUS_LABEL[item.status] || 'đã cập nhật'}</p>`;
          items.push({
            id: `order-${order.id}-${index}`,
            type: 'order',
            category: 'Order',
            isUnRead: isRecent(order.createdAt),
            avatarUrl: null,
            createdAt: order.createdAt,
            title,
          });
        });
      });
    } else if (role === 'AFFILIATE') {
      (referrerOrders?.items ?? []).forEach((order) => {
        order.items.forEach((item, index) => {
          if (item.status !== 'DONE') return;
          const productName = item.productId?.name || 'sản phẩm';
          const commission = (item.productId?.price || 0) * item.quantity * COMMISSION_RATE;
          items.push({
            id: `commission-${order.id}-${index}`,
            type: 'order',
            category: 'Affiliate',
            isUnRead: isRecent(order.createdAt),
            avatarUrl: null,
            createdAt: order.createdAt,
            title: `<p>Bạn nhận được <strong>${fEth(commission)} ETH</strong> hoa hồng từ đơn hàng <strong>${productName}</strong></p>`,
          });
        });
      });

      (airdrops ?? []).forEach((airdrop) => {
        items.push({
          id: `airdrop-${airdrop.campaignId}`,
          type: 'order',
          category: 'Airdrop',
          isUnRead: true,
          avatarUrl: null,
          createdAt: null,
          title: `<p>Bạn có phần thưởng Airdrop <strong>${fEth(Number(formatEther(airdrop.amountWei)))} ETH</strong> đang chờ nhận</p>`,
        });
      });
    } else {
      (buyerOrders?.items ?? []).forEach((order) => {
        order.items.forEach((item, index) => {
          if (!item.status || item.status === 'NONE') return;
          const productName = item.productId?.name || 'sản phẩm';
          items.push({
            id: `order-${order.id}-${index}`,
            type: 'order',
            category: 'Order',
            isUnRead: isRecent(order.createdAt),
            avatarUrl: null,
            createdAt: order.createdAt,
            title: `<p>Đơn hàng <strong>${productName}</strong> của bạn ${STATUS_LABEL[item.status] || 'đã cập nhật'}</p>`,
          });
        });
      });
    }

    return items
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 20);
  }, [role, sellerOrders, referrerOrders, airdrops, buyerOrders]);
}
