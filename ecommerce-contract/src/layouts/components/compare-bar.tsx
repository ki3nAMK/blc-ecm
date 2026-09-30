import type { IProductItem } from '@/types/product';

import { get } from 'lodash';
import { useProducts } from '@/states/products';
import { useCompare } from '@/states/compare';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Persistent across every /dashboard/* page (mounted once in DashboardLayout, same as
// <Toaster/>) so the selection survives navigation while the user browses for more
// products to compare.
export function CompareBar() {
  const router = useRouter();
  const { products } = useProducts();
  const { compareIds, maxCompare, toggleCompare, clearCompare } = useCompare();

  if (compareIds.length === 0) return null;

  const allProducts = get(products, 'data', []) as IProductItem[];
  const compareProducts = compareIds
    .map((id) => allProducts.find((product) => product.id === id))
    .filter(Boolean) as IProductItem[];

  return (
    <Paper
      elevation={12}
      sx={{
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1300,
        position: 'fixed',
        borderRadius: 0,
        borderTop: (theme) => `solid 1px ${theme.vars.palette.divider}`,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ px: { xs: 2, md: 4 }, py: 1.5, maxWidth: 1200, mx: 'auto' }}
      >
        <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>
          Compare ({compareProducts.length}/{maxCompare})
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexGrow: 1, overflowX: 'auto' }}>
          {compareProducts.map((product) => (
            <Box key={product.id} sx={{ position: 'relative', flexShrink: 0 }}>
              <Avatar variant="rounded" src={product.coverUrl} alt={product.name} sx={{ width: 44, height: 44 }} />
              <IconButton
                size="small"
                onClick={() => toggleCompare(product.id)}
                sx={{
                  top: -8,
                  right: -8,
                  width: 18,
                  height: 18,
                  position: 'absolute',
                  bgcolor: 'error.main',
                  color: 'common.white',
                  '&:hover': { bgcolor: 'error.dark' },
                }}
              >
                <Iconify icon="mingcute:close-line" width={12} />
              </IconButton>
            </Box>
          ))}
        </Stack>

        <Button color="inherit" onClick={clearCompare} sx={{ whiteSpace: 'nowrap' }}>
          Clear
        </Button>

        <Button
          variant="contained"
          disabled={compareProducts.length < 2}
          onClick={() => router.push(paths.dashboard.product.compare)}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Compare Now
        </Button>
      </Stack>
    </Paper>
  );
}
