import type { IProductItem } from '@/types/product';

import { get } from 'lodash';
import { useProducts } from '@/states/products';
import { useFavorites } from '@/states/favorites';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductCard } from './components/product-card';

// ----------------------------------------------------------------------

export default function FavoritesView() {
  const router = useRouter();
  const { products } = useProducts();
  const { favoriteIds } = useFavorites();

  const allProducts = get(products, 'data', []) as IProductItem[];
  const favoriteProducts = allProducts.filter((product) => favoriteIds.includes(product.id));

  const handleViewProduct = (id: string) => {
    router.push(paths.dashboard.product.details(id));
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <CustomBreadcrumbs
        heading="Favorites"
        links={[{ name: 'Home', href: paths.dashboard.root }, { name: 'Favorites' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {favoriteProducts.length === 0 ? (
        <EmptyContent
          title="No favorites yet"
          description="Tap the heart on any product to save it here."
          sx={{ py: 15 }}
        />
      ) : (
        <Grid container spacing={3}>
          {favoriteProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} onView={handleViewProduct} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
