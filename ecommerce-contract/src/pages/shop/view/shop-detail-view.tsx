import type { IShop } from 'src/types/shop';
import type { IProductItem } from 'src/types/product';

import { get } from 'lodash';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import { useAuthContext } from '@/auth/hooks';
import shopService from '@/lib/service/shop.service';
import productService from '@/lib/service/product.service';
import messageService from '@/lib/service/message.service';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductCard } from '../../products/components/product-card';

// ----------------------------------------------------------------------

const PRODUCTS_PER_PAGE = 12;

type Props = {
  sellerId: string;
};

export function ShopDetailView({ sellerId }: Props) {
  const router = useRouter();
  const { user, authenticated } = useAuthContext();
  const [page, setPage] = useState(1);
  const [starting, setStarting] = useState(false);

  const isOwnShop = authenticated && user?.id === sellerId;

  const handleChat = async () => {
    if (!authenticated) {
      toast.error('Please log in to chat with this shop');
      return;
    }
    setStarting(true);
    try {
      const conversation = await messageService.startConversation(sellerId);
      router.push(paths.dashboard.messages.details(conversation.id));
    } catch (error) {
      toast.error('Failed to start conversation');
    } finally {
      setStarting(false);
    }
  };

  const { data: shop, isLoading: shopLoading } = useQuery({
    queryKey: ['shop-detail', sellerId],
    queryFn: () => shopService.getDetail(sellerId),
    enabled: !!sellerId,
  });

  const { data: productsResp, isLoading: productsLoading } = useQuery({
    queryKey: ['shop-products', sellerId, page],
    queryFn: () => productService.getBySeller(sellerId, page, PRODUCTS_PER_PAGE),
    enabled: !!sellerId,
  });

  const products = get(productsResp, 'data', []) as IProductItem[];
  const totalPages = get(productsResp, 'pagination.totalPages', 1) as number;

  const handleViewProduct = (id: string) => {
    router.push(paths.dashboard.product.details(id));
  };

  if (shopLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <EmptyContent title="Loading shop..." />
      </Container>
    );
  }

  if (!shop) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <EmptyContent title="Shop not found" />
      </Container>
    );
  }

  return (
    <>
      <Box
        sx={{
          width: 1,
          height: { xs: 140, md: 220 },
          bgcolor: 'background.neutral',
          backgroundImage: shop.shopBanner ? `url(${shop.shopBanner})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <CustomBreadcrumbs
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Shops', href: paths.dashboard.shop.root },
            { name: shop.name },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ mb: 4 }}
        >
          <Avatar src={shop.avatar} alt={shop.name} sx={{ width: 88, height: 88 }} />

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h4">{shop.name}</Typography>

            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 0.5, mb: 1 }}>
              <Rating value={shop.avgRating} precision={0.1} size="small" readOnly />
              <Typography variant="body2" color="text.secondary">
                {shop.avgRating.toFixed(1)} ({fShortenNumber(shop.totalReviews)} reviews)
              </Typography>
            </Stack>

            <Stack direction="row" spacing={3} sx={{ typography: 'body2', color: 'text.secondary' }}>
              <span>{shop.totalProducts} products</span>
              <span>{fShortenNumber(shop.totalSold)} sold</span>
              <span>Joined {fDate(shop.joinDate)}</span>
            </Stack>

            {shop.shopDescription && (
              <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary' }}>
                {shop.shopDescription}
              </Typography>
            )}
          </Box>

          {!isOwnShop && (
            <Button
              variant="contained"
              startIcon={<Iconify icon="solar:chat-round-dots-bold-duotone" />}
              onClick={handleChat}
              disabled={starting}
              sx={{ flexShrink: 0 }}
            >
              Chat
            </Button>
          )}
        </Stack>

        <Divider sx={{ mb: 4 }} />

        <Typography variant="h5" sx={{ mb: 3 }}>
          Products from this shop
        </Typography>

        {productsLoading ? (
          <EmptyContent title="Loading products..." />
        ) : products.length === 0 ? (
          <EmptyContent title="No products yet" />
        ) : (
          <>
            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
              }}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onView={handleViewProduct} />
              ))}
            </Box>

            {totalPages > 1 && (
              <Stack alignItems="center" sx={{ mt: 5 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, newPage) => setPage(newPage)}
                  color="primary"
                />
              </Stack>
            )}
          </>
        )}
      </Container>
    </>
  );
}
