import type { IProductItem } from 'src/types/product';

import { get } from 'lodash';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import productService from '@/lib/service/product.service';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductCard } from './components/product-card';

// ----------------------------------------------------------------------

const PRODUCTS_PER_PAGE = 12;

type Props = {
  category: string;
};

export function CategoryDetailView({ category }: Props) {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data: productsResp, isLoading } = useQuery({
    queryKey: ['category-products', category, page],
    queryFn: () => productService.getByCategory(category, page, PRODUCTS_PER_PAGE),
    enabled: !!category,
  });

  const products = get(productsResp, 'data', []) as IProductItem[];
  const totalPages = get(productsResp, 'pagination.totalPages', 1) as number;
  const total = get(productsResp, 'pagination.total', 0) as number;

  const handleViewProduct = (id: string) => {
    router.push(paths.dashboard.product.details(id));
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <CustomBreadcrumbs
        heading={`${category}${total ? ` (${total})` : ''}`}
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: category }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {isLoading ? (
        <EmptyContent title="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyContent title="No products in this category yet" />
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
  );
}
