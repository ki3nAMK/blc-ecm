import type { IOrder } from 'src/types/order';
import type { IProductItem } from 'src/types/product';

import { get } from 'lodash';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useAuthContext } from 'src/auth/hooks';
import { useProducts } from '@/states/products';
import productService from '@/lib/service/product.service';

import { fEth } from 'src/utils/format-number';
import { DashboardContent } from 'src/layouts/dashboard';
import { MotivationIllustration } from 'src/assets/illustrations';

import { EcommerceWelcome } from '../ecommerce-welcome';
import { EcommerceYearlySales } from '../ecommerce-yearly-sales';
import { EcommerceTopProducts } from '../ecommerce-top-products';
import { EcommerceSalesOverview } from '../ecommerce-sales-overview';
import { EcommerceWidgetSummary } from '../ecommerce-widget-summary';
import { EcommerceNewProducts } from '../ecommerce-new-products';
import { EcommerceLatestProducts } from '../ecommerce-latest-products';

// ----------------------------------------------------------------------

const TRAILING_MONTHS = 6;

const STATUS_BUCKETS = [
  { label: 'Hoàn tất', color: 'success' as const, statuses: ['DONE'] },
  {
    label: 'Đang xử lý',
    color: 'info' as const,
    statuses: [
      'NONE',
      'DEPOSIT_ESCROW',
      'FULLY_DEPOSITED',
      'SELLER_FINALIZED',
      'ORDER_RECEIVED',
      'ON_WAITING_REFUND',
    ],
  },
  { label: 'Đã hủy', color: 'error' as const, statuses: ['CANCLED'] },
];

type FlatItem = {
  productId: string;
  name: string;
  coverUrl: string;
  quantity: number;
  price: number;
  status: string;
};

function flattenItems(orders: IOrder[]): FlatItem[] {
  return orders.flatMap((order) =>
    order.items.map((item) => ({
      productId: item.productId?.id,
      name: item.productId?.name || 'Unknown product',
      coverUrl: item.productId?.coverUrl,
      quantity: item.quantity,
      price: item.productId?.price || 0,
      status: item.status,
    }))
  );
}

function buildMonthlyTrend(orders: IOrder[], months: number) {
  const now = new Date();

  const buckets = Array.from({ length: months }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString('en-US', { month: 'short' }),
      revenue: 0,
      orders: 0,
      units: 0,
    };
  });

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const bucket = buckets.find((b) => b.key === key);
    if (!bucket) return;

    bucket.orders += 1;
    order.items.forEach((item) => {
      if (item.status === 'DONE') {
        bucket.revenue += (item.productId?.price || 0) * item.quantity;
        bucket.units += item.quantity;
      }
    });
  });

  return buckets;
}

function growthPercent(series: number[]) {
  const last = series[series.length - 1] || 0;
  const prev = series[series.length - 2] || 0;
  if (prev === 0) return last > 0 ? 100 : 0;
  return ((last - prev) / prev) * 100;
}

export function OverviewEcommerceView() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const isSeller = user?.role === 'SELLER';

  const { orders, products: globalProductsResp } = useProducts();

  const { data: myProductsResp } = useQuery({
    queryKey: ['dashboard-my-products'],
    enabled: isSeller,
    queryFn: () => productService.getMyProducts(1, 100),
  });

  const myProducts = get(myProductsResp, 'data', []) as IProductItem[];
  const globalProducts = get(globalProductsResp, 'data', []) as IProductItem[];

  const items = useMemo(() => flattenItems(orders), [orders]);
  const doneItems = useMemo(() => items.filter((item) => item.status === 'DONE'), [items]);

  const totalOrders = orders.length;
  const totalRevenue = useMemo(
    () => doneItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [doneItems]
  );
  const totalUnits = useMemo(
    () => doneItems.reduce((sum, item) => sum + item.quantity, 0),
    [doneItems]
  );

  const monthlyTrend = useMemo(() => buildMonthlyTrend(orders, TRAILING_MONTHS), [orders]);
  const monthLabels = monthlyTrend.map((bucket) => bucket.label);
  const revenueSeries = monthlyTrend.map((bucket) => bucket.revenue);
  const unitsSeries = monthlyTrend.map((bucket) => bucket.units);
  const orderCountSeries = monthlyTrend.map((bucket) => bucket.orders);

  const statusBreakdown = useMemo(() => {
    const total = items.length || 1;
    return STATUS_BUCKETS.map((bucket) => {
      const bucketItems = items.filter((item) => bucket.statuses.includes(item.status));
      const amount = bucketItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return {
        label: bucket.label,
        color: bucket.color,
        value: (bucketItems.length / total) * 100,
        totalAmount: amount,
      };
    });
  }, [items]);

  const topProducts = useMemo(() => {
    if (!isSeller) return [];

    const byProduct = new Map<
      string,
      { id: string; name: string; coverUrl: string; units: number; revenue: number }
    >();

    doneItems.forEach((item) => {
      if (!item.productId) return;
      const entry = byProduct.get(item.productId) || {
        id: item.productId,
        name: item.name,
        coverUrl: item.coverUrl,
        units: 0,
        revenue: 0,
      };
      entry.units += item.quantity;
      entry.revenue += item.price * item.quantity;
      byProduct.set(item.productId, entry);
    });

    return Array.from(byProduct.values())
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);
  }, [doneItems, isSeller]);

  const carouselProducts = useMemo(
    () =>
      [...(isSeller ? myProducts : globalProducts)]
        .sort(
          (a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
        )
        .slice(0, 5),
    [isSeller, myProducts, globalProducts]
  );

  const newProductsList = carouselProducts.map((product) => ({
    id: product.id,
    name: product.name,
    coverUrl: product.coverUrl,
  }));

  const latestProductsList = carouselProducts.map((product) => ({
    id: product.id,
    name: product.name,
    coverUrl: product.coverUrl,
    price: product.price,
    priceSale: product.priceSale ?? 0,
    colors: product.colors,
  }));

  const currentYear = String(new Date().getFullYear());

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <EcommerceWelcome
            title={`Xin chào 👋  \n ${user?.name || user?.publicAddress || ''}`}
            description={
              isSeller
                ? `Bạn có ${totalOrders} đơn hàng với doanh thu ${fEth(totalRevenue)} ETH.`
                : `Bạn đã đặt ${totalOrders} đơn hàng với tổng chi tiêu ${fEth(totalRevenue)} ETH.`
            }
            img={<MotivationIllustration hideBackground />}
            action={
              <Button
                component={RouterLink}
                href={isSeller ? paths.dashboard.seller.order.root : paths.dashboard.product.root}
                variant="contained"
                color="primary"
              >
                {isSeller ? 'Xem đơn hàng' : 'Mua sắm ngay'}
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          {newProductsList.length > 0 && <EcommerceNewProducts list={newProductsList} />}
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title={isSeller ? 'Sản phẩm đã bán' : 'Sản phẩm đã mua'}
            percent={growthPercent(unitsSeries)}
            total={totalUnits}
            caption="tháng trước"
            chart={{ categories: monthLabels, series: unitsSeries }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title={isSeller ? 'Doanh thu (ETH)' : 'Chi tiêu (ETH)'}
            percent={growthPercent(revenueSeries)}
            total={totalRevenue}
            caption="tháng trước"
            chart={{
              colors: [theme.vars.palette.warning.light, theme.vars.palette.warning.main],
              categories: monthLabels,
              series: revenueSeries,
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <EcommerceWidgetSummary
            title="Tổng đơn hàng"
            percent={growthPercent(orderCountSeries)}
            total={totalOrders}
            caption="tháng trước"
            chart={{
              colors: [theme.vars.palette.error.light, theme.vars.palette.error.main],
              categories: monthLabels,
              series: orderCountSeries,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={7}>
          <EcommerceYearlySales
            title={isSeller ? 'Doanh thu theo tháng' : 'Chi tiêu theo tháng'}
            subheader={`${TRAILING_MONTHS} tháng gần nhất`}
            chart={{
              categories: monthLabels,
              series: [
                {
                  name: currentYear,
                  data: [
                    { name: isSeller ? 'Doanh thu (ETH)' : 'Chi tiêu (ETH)', data: revenueSeries },
                    { name: 'Đơn hàng', data: orderCountSeries },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <EcommerceSalesOverview
            title="Tình trạng đơn hàng"
            subheader="Phân bổ theo trạng thái"
            data={statusBreakdown}
            formatValue={(value: number) => `${fEth(value)} ETH`}
          />
        </Grid>

        {isSeller && (
          <Grid xs={12} md={7}>
            <EcommerceTopProducts
              title="Sản phẩm bán chạy"
              subheader="Xếp hạng theo số lượng đã bán"
              data={topProducts}
            />
          </Grid>
        )}

        <Grid xs={12} md={isSeller ? 5 : 12} lg={isSeller ? 5 : 4}>
          {latestProductsList.length > 0 && (
            <EcommerceLatestProducts
              title={isSeller ? 'Sản phẩm của bạn' : 'Sản phẩm mới'}
              list={latestProductsList}
            />
          )}
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
