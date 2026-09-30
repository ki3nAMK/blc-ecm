import type { IShop } from 'src/types/shop';

import { get } from 'lodash';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fShortenNumber } from 'src/utils/format-number';

import shopService from '@/lib/service/shop.service';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

const SHOPS_PER_PAGE = 12;

export function ShopListView() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['shop-list', page],
    queryFn: () => shopService.getList(page, SHOPS_PER_PAGE),
  });

  const shops = get(data, 'data', []) as IShop[];
  const totalPages = get(data, 'pagination.totalPages', 1) as number;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <CustomBreadcrumbs
        heading="Shops"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Shops' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {isLoading ? (
        <EmptyContent title="Loading shops..." />
      ) : shops.length === 0 ? (
        <EmptyContent title="No shops yet" />
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            }}
          >
            {shops.map((shop) => (
              <Card
                key={shop.id}
                component={RouterLink}
                href={paths.dashboard.shop.details(shop.id)}
                sx={{
                  display: 'block',
                  textDecoration: 'none',
                  transition: 'transform .3s, box-shadow .3s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
                }}
              >
                {shop.shopBanner && (
                  <Box
                    component="img"
                    src={shop.shopBanner}
                    alt={shop.name}
                    sx={{ width: 1, height: 120, objectFit: 'cover' }}
                  />
                )}
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                    <Avatar src={shop.avatar} alt={shop.name} sx={{ width: 48, height: 48 }} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle1" noWrap sx={{ color: 'text.primary' }}>
                        {shop.name}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Rating value={shop.avgRating} precision={0.1} size="small" readOnly />
                        <Typography variant="caption" color="text.secondary">
                          ({fShortenNumber(shop.totalReviews)})
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>

                  {shop.shopDescription && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1.5,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                      }}
                    >
                      {shop.shopDescription}
                    </Typography>
                  )}

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ typography: 'caption', color: 'text.disabled' }}
                  >
                    <span>{shop.totalProducts} products</span>
                    <span>{fShortenNumber(shop.totalSold)} sold</span>
                  </Stack>
                </CardContent>
              </Card>
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
  );
}
