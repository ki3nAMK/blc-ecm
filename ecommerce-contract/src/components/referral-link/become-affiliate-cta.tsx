import { useState } from 'react';
import { toast } from 'sonner';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useAuthContext } from '@/auth/hooks';
import authService from '@/lib/service/auth.service';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function BecomeAffiliateCta() {
  const { user, checkUserSession } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!user || user.role === 'AFFILIATE') return null;

  const handleBecomeAffiliate = async () => {
    setLoading(true);
    try {
      await authService.becomeAffiliate();
      await checkUserSession();
      toast.success('You are now an affiliate!');
      router.push(paths.dashboard.affiliate.general);
    } catch (error) {
      console.error('becomeAffiliate error:', error);
      toast.error('Failed to become an affiliate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            <Iconify icon="solar:gift-bold" width={24} sx={{ color: 'primary.main' }} />
            <Typography variant="h6">Become an Affiliate</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Get your own referral link and earn 2% ETH commission on every purchase made through it.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleBecomeAffiliate}
          disabled={loading}
          startIcon={<Iconify icon="solar:gift-bold" />}
          sx={{ flexShrink: 0 }}
        >
          {loading ? 'Please wait...' : 'Become an Affiliate'}
        </Button>
      </Stack>
    </Card>
  );
}
