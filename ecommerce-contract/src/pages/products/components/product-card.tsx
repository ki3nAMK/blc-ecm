import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { RenderCellPrice } from './product-table-row';

// ----------------------------------------------------------------------

interface ProductCardProps {
  product: any;
  onView: (id: string) => void;
  isFeatured?: boolean;
  compact?: boolean;
}

export function ProductCard({ product, onView, isFeatured = false, compact = false }: ProductCardProps) {
  const { t } = useTranslation();
  const isOutOfStock = product.inventoryType === 'out of stock';
  const isLowStock = product.inventoryType === 'low stock';
  const seller = typeof product.sellerId === 'object' ? product.sellerId : null;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
        opacity: isOutOfStock ? 0.6 : 1,
        position: 'relative',
      }}
    >
      {isFeatured && (
        <Chip
          label="Featured"
          color="primary"
          size="small"
          sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}
        />
      )}

      <Box sx={{ position: 'relative', pt: '75%', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={product.coverUrl}
          alt={product.name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {isOutOfStock && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" color="common.white" fontWeight={700}>
              {t('common.outOfStock')}
            </Typography>
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: compact ? 2 : 3 }}>
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            {product.category}
          </Typography>

          {seller && (
            <Link
              component={RouterLink}
              href={paths.dashboard.shop.details(seller.id)}
              variant="caption"
              color="text.secondary"
              underline="hover"
              onClick={(event) => event.stopPropagation()}
              sx={{ width: 'fit-content' }}
            >
              {seller.name}
            </Link>
          )}

          <Typography
            variant={compact ? 'subtitle2' : 'h6'}
            fontWeight={600}
            noWrap={!compact}
            sx={{
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={() => onView(product.id)}
          >
            {product.name}
          </Typography>

          {!compact && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Added on {format(new Date(product.createdAt), 'dd MMM yyyy')}
            </Typography>
          )}

          <Stack direction="row" alignItems="center" spacing={1}>
            <RenderCellPrice params={{ row: product } as any} />
            <Typography variant="caption" color="text.secondary">
              · {product.available} in stock
            </Typography>
          </Stack>

          {isLowStock && !compact && <Chip label={t('common.lowStock')} color="warning" size="small" />}
        </Stack>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          size={compact ? 'small' : 'medium'}
          startIcon={<Iconify icon="mingcute:shopping-bag-2-line" />}
          disabled={isOutOfStock}
          onClick={() => onView(product.id)}
        >
          {isOutOfStock ? t('common.viewDetails') : t('common.addToCart')}
        </Button>
      </Box>
    </Card>
  );
}
