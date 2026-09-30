import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { toast } from 'sonner';

import { useAuthContext } from '@/auth/hooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ReferralLinkCard() {
  const { user } = useAuthContext();

  if (!user?.referralCode) return null;

  const referralLink = `${window.location.origin}/?ref=${user.referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={1.5}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:gift-bold" width={24} sx={{ color: 'primary.main' }} />
          <Typography variant="h6">Your Referral Link</Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          Share this link — earn 2% ETH commission on every purchase made through it.
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField fullWidth size="small" value={referralLink} InputProps={{ readOnly: true }} />
          <Button
            variant="contained"
            onClick={handleCopy}
            startIcon={<Iconify icon="solar:copy-bold" />}
            sx={{ flexShrink: 0 }}
          >
            Copy
          </Button>
        </Box>
      </Stack>
    </Card>
  );
}
