import type { IOrder } from 'src/types/order';

import { useMemo } from 'react';
import { formatEther } from 'ethers';
import { useQuery } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';
import Skeleton from '@mui/material/Skeleton';

import { useAuthContext } from '@/auth/hooks';
import orderService from '@/lib/service/order.service';
import airdropService from '@/lib/service/airdrop.service';
import { fEth } from 'src/utils/format-number';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';
import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';
import { useClaimAirdrop } from 'src/hooks/use-claim-airdrop';

import { ReferralLinkCard } from 'src/components/referral-link/referral-link-card';

// ----------------------------------------------------------------------

const COMMISSION_RATE = 0.02;

const STATUS_COLOR: Record<string, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
  NONE: 'info',
  DEPOSIT_ESCROW: 'warning',
  FULLY_DEPOSITED: 'info',
  CANCLED: 'error',
  ON_WAITING_REFUND: 'warning',
  SELLER_FINALIZED: 'info',
  ORDER_RECEIVED: 'success',
  DONE: 'success',
};

type FlatRow = {
  key: string;
  productName: string;
  buyerLabel: string;
  quantity: number;
  price: number;
  commission: number;
  status: string;
};

function flattenOrders(orders: IOrder[]): FlatRow[] {
  const rows: FlatRow[] = [];

  orders.forEach((order) => {
    const buyer = order.buyer as any;
    const buyerLabel = buyer?.name || buyer?.publicAddress || 'Unknown buyer';

    order.items.forEach((item, index) => {
      const product = item.productId as any;
      const price = product?.price || 0;

      rows.push({
        key: `${order.id}-${index}`,
        productName: product?.name || 'Unknown product',
        buyerLabel,
        quantity: item.quantity,
        price,
        commission: price * item.quantity * COMMISSION_RATE,
        status: item.status,
      });
    });
  });

  return rows;
}

function AirdropCard() {
  const { claim, loading } = useClaimAirdrop();

  const { data: airdrops = [], isLoading, refetch } = useQuery({
    queryKey: ['my-airdrops'],
    queryFn: () => airdropService.getMyAirdrops(),
  });

  if (isLoading || airdrops.length === 0) return null;

  const handleClaim = async (campaignId: number) => {
    const airdrop = airdrops.find((a) => a.campaignId === campaignId);
    if (!airdrop) return;

    const success = await claim(airdrop);
    if (success) refetch();
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Airdrop khả dụng" subheader="Phần thưởng dành cho affiliate xuất sắc" />
      <Stack spacing={2} sx={{ p: 3, pt: 2 }}>
        {airdrops.map((airdrop) => (
          <Stack
            key={airdrop.campaignId}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 2, border: (theme) => `1px dashed ${theme.vars.palette.divider}`, borderRadius: 1 }}
          >
            <Stack>
              <Typography variant="subtitle2">{airdrop.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {fEth(formatEther(airdrop.amountWei))} ETH
              </Typography>
            </Stack>
            <Button
              variant="contained"
              disabled={loading}
              onClick={() => handleClaim(airdrop.campaignId)}
            >
              Claim
            </Button>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

export function AffiliateDashboardView() {
  const { user } = useAuthContext();

  const { data, isLoading } = useQuery({
    queryKey: ['affiliate-orders'],
    enabled: user?.role === 'AFFILIATE',
    queryFn: () => orderService.getOrdersByReferrer(),
  });

  const rows = useMemo(() => flattenOrders(data?.items ?? []), [data]);

  const stats = useMemo(() => {
    const totalReferred = rows.length;
    const completed = rows.filter((r) => r.status === 'DONE');
    const totalEarned = completed.reduce((sum, r) => sum + r.commission, 0);

    return { totalReferred, completedCount: completed.length, totalEarned };
  }, [rows]);

  return (
    <RoleBasedGuard currentRole={user?.role} acceptRoles={['AFFILIATE']} hasContent>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="Affiliate Dashboard"
          links={[{ name: 'Dashboard' }, { name: 'Affiliate' }]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Grid2 container spacing={3} sx={{ mb: 3 }}>
          <Grid2 xs={12}>
            <ReferralLinkCard />
          </Grid2>
        </Grid2>

        <AirdropCard />

        <Grid2 container spacing={3} sx={{ mb: 3 }}>
          <Grid2 xs={12} sm={4}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Referred Orders
              </Typography>
              <Typography variant="h3" sx={{ mt: 1 }}>
                {stats.totalReferred}
              </Typography>
            </Card>
          </Grid2>
          <Grid2 xs={12} sm={4}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Completed & Paid Out
              </Typography>
              <Typography variant="h3" sx={{ mt: 1 }}>
                {stats.completedCount}
              </Typography>
            </Card>
          </Grid2>
          <Grid2 xs={12} sm={4}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Earned
              </Typography>
              <Typography variant="h3" sx={{ mt: 1 }}>
                {fEth(stats.totalEarned)} ETH
              </Typography>
            </Card>
          </Grid2>
        </Grid2>

        <Card>
          {isLoading ? (
            <Skeleton variant="rectangular" height={240} sx={{ m: 3 }} />
          ) : rows.length === 0 ? (
            <EmptyContent title="No referred orders yet" sx={{ py: 8 }} />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Buyer</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Commission (2%)</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell>{row.buyerLabel}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right">{fEth(row.price)} ETH</TableCell>
                    <TableCell align="right">{fEth(row.commission)} ETH</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={row.status}
                        color={STATUS_COLOR[row.status] || 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </DashboardContent>
    </RoleBasedGuard>
  );
}
