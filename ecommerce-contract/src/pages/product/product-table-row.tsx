import type { GridCellParams } from '@mui/x-data-grid';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { fCurrency } from 'src/utils/format-number';
import { fTime, fDate } from 'src/utils/format-time';
import { getEffectiveFlashSale } from 'src/utils/flash-sale';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CountdownTimer } from 'src/components/countdown';
import { useListProductOnChain } from 'src/hooks/use-list-product-on-chain';
import { useFlashSaleOnChain } from 'src/hooks/use-flash-sale-on-chain';

import { FlashSaleDialog } from './flash-sale-dialog';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellPrice({ params }: ParamsProps) {
  return fCurrency(params.row.price);
}

export function RenderCellPublish({ params }: ParamsProps) {
  return (
    <Label variant="soft" color={(params.row.publish === 'published' && 'info') || 'default'}>
      {params.row.publish}
    </Label>
  );
}

export function RenderCellBlockchainAction({
  params,
  onListed,
}: ParamsProps & { onListed?: () => void }) {
  const { listOnChain, loading } = useListProductOnChain();

  if (params.row.publish === 'published') {
    return (
      <Label variant="soft" color="success" startIcon={<Iconify icon="eva:checkmark-fill" />}>
        Listed
      </Label>
    );
  }

  if (!params.row.tokenId) {
    return (
      <Label variant="soft" color="default">
        Not minted
      </Label>
    );
  }

  const handleClick = async () => {
    const success = await listOnChain({
      id: params.row.id,
      tokenId: params.row.tokenId,
      escrow: params.row.escrow,
      price: params.row.price,
      quantity: params.row.quantity,
    });
    if (success) onListed?.();
  };

  return (
    <Button
      size="small"
      variant="outlined"
      color="warning"
      disabled={loading}
      onClick={handleClick}
      startIcon={loading ? <CircularProgress size={14} /> : <Iconify icon="solar:link-bold" />}
    >
      {loading ? 'Listing...' : 'List on Blockchain'}
    </Button>
  );
}

export function RenderCellFlashSaleAction({
  params,
  onChanged,
}: ParamsProps & { onChanged?: () => void }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { cancelFlashSaleOnChain, loading } = useFlashSaleOnChain();

  if (params.row.publish !== 'published') {
    return (
      <Label variant="soft" color="default">
        Not listed
      </Label>
    );
  }

  const flashSale = getEffectiveFlashSale(params.row as { price: number; flashSale?: any });

  if (flashSale.isActive) {
    return (
      <Stack spacing={0.5} alignItems="flex-start">
        <CountdownTimer endTime={flashSale.endTime!} />
        <Button
          size="small"
          color="error"
          disabled={loading}
          onClick={async () => {
            const success = await cancelFlashSaleOnChain(params.row.id);
            if (success) onChanged?.();
          }}
          startIcon={loading ? <CircularProgress size={14} /> : <Iconify icon="solar:close-circle-bold" />}
        >
          Cancel Sale
        </Button>
      </Stack>
    );
  }

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        color="error"
        onClick={() => setDialogOpen(true)}
        startIcon={<Iconify icon="solar:tag-price-bold" />}
      >
        Flash Sale
      </Button>

      <FlashSaleDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        product={{
          id: params.row.id,
          name: params.row.name,
          price: params.row.price,
          escrow: params.row.escrow,
        }}
        onSuccess={onChanged}
      />
    </>
  );
}

export function RenderCellCreatedAt({ params }: ParamsProps) {
  return (
    <Stack spacing={0.5}>
      <Box component="span">{fDate(params.row.createdAt)}</Box>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box>
    </Stack>
  );
}

export function RenderCellStock({ params }: ParamsProps) {
  return (
    <Stack justifyContent="center" sx={{ typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        value={(params.row.available * 100) / params.row.quantity}
        variant="determinate"
        color={
          (params.row.inventoryType === 'out of stock' && 'error') ||
          (params.row.inventoryType === 'low stock' && 'warning') ||
          'success'
        }
        sx={{ mb: 1, width: 1, height: 6, maxWidth: 80 }}
      />
      {!!params.row.available && params.row.available} {params.row.inventoryType}
    </Stack>
  );
}

export function RenderCellProduct({
  params,
  onViewRow,
}: ParamsProps & {
  onViewRow: () => void;
}) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Avatar
        alt={params.row.name}
        src={params.row.coverUrl}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={onViewRow}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.name}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {params.row.category}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
