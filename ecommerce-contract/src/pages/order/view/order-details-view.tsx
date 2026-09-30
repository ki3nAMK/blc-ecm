import type { IOrder } from 'src/types/order';

import { useCallback, useMemo, useState } from 'react';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { normalizeOrder, ORDER_STATUS_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { OrderDetailsHistory } from '../order-details-history';
import { OrderDetailsInfo } from '../order-details-info';
import { OrderDetailsItems } from '../order-details-item';
import { OrderDetailsToolbar } from '../order-details-toolbar';

// ----------------------------------------------------------------------

type Props = {
  order?: IOrder;
  id: string
};

export function OrderDetailsView({ order, id }: Props) {
  const [status, setStatus] = useState('Pending');

  const handleChangeStatus = useCallback((newValue: string) => {
    setStatus(newValue);
  }, []);

  if (!order || !order.items?.length) return <div>Loading...</div>;

  const data = useMemo(() => {
    return normalizeOrder(order)
  }, [order])

  return (
    <DashboardContent>
      <OrderDetailsToolbar
        backLink={paths.dashboard.seller.order.root}
        orderNumber={data?.orderNumber}
        createdAt={data?.createdAt}
        status={status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              items={data?.items}
              taxes={data?.taxes}
              shipping={data?.shipping}
              discount={data?.discount}
              subtotal={data?.subtotal}
              totalAmount={data?.totalAmount}
              orderId={id}
              buyerAddress={data?.buyer?.publicAddress}
              referrerAddress={data?.referrer?.publicAddress}
            />

            <OrderDetailsHistory history={data?.history} />
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo
            customer={data?.customer}
            delivery={data?.delivery}
            payment={data?.payment}
            shippingAddress={data?.shippingAddress}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
