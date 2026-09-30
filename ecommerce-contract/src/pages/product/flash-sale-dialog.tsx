import { useMemo, useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { fEth } from 'src/utils/format-number';
import { useFlashSaleOnChain } from 'src/hooks/use-flash-sale-on-chain';

// ----------------------------------------------------------------------

const DURATION_OPTIONS = [
  { value: 1, label: '1 hour' },
  { value: 6, label: '6 hours' },
  { value: 24, label: '24 hours' },
  { value: 72, label: '3 days' },
];

type Props = {
  open: boolean;
  onClose: () => void;
  product: { id: string; name: string; price: number; escrow: number };
  onSuccess?: () => void;
};

export function FlashSaleDialog({ open, onClose, product, onSuccess }: Props) {
  const [discountPercent, setDiscountPercent] = useState(20);
  const [durationHours, setDurationHours] = useState(24);
  const { setFlashSaleOnChain, loading } = useFlashSaleOnChain();

  const discountedPrice = useMemo(
    () => Math.round(product.price * (1 - discountPercent / 100) * 1e6) / 1e6,
    [product.price, discountPercent]
  );

  const discountedEscrow = useMemo(
    () => Math.round(product.escrow * (discountedPrice / product.price) * 1e6) / 1e6,
    [product.escrow, product.price, discountedPrice]
  );

  const handleSubmit = async () => {
    const success = await setFlashSaleOnChain({
      id: product.id,
      discountedPrice,
      discountedEscrow,
      durationSeconds: durationHours * 3600,
    });

    if (success) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Start Flash Sale</DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Discount <strong>{product.name}</strong> for a limited time. The new price is enforced
            on-chain — buyers pay exactly this amount for the duration you set.
          </Typography>

          <TextField
            select
            label="Discount"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((pct) => (
              <MenuItem key={pct} value={pct}>
                {pct}% off
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Duration"
            value={durationHours}
            onChange={(e) => setDurationHours(Number(e.target.value))}
          >
            {DURATION_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction="row" justifyContent="space-between" sx={{ typography: 'body2' }}>
            <span>New price</span>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography
                variant="body2"
                sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
              >
                {fEth(product.price)}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
                {fEth(discountedPrice)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
        >
          {loading ? 'Starting...' : 'Start Flash Sale'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
