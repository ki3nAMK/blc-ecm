import type { IProductItem } from '@/types/product';

import { get } from 'lodash';
import { toast } from 'sonner';
import { useCart } from '@/states/carts';
import { useProducts } from '@/states/products';
import { useCompare } from '@/states/compare';

import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fEth } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ColorPreview } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export default function CompareView() {
  const router = useRouter();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { compareIds, toggleCompare } = useCompare();

  const allProducts = get(products, 'data', []) as IProductItem[];
  const compareProducts = compareIds
    .map((id) => allProducts.find((product) => product.id === id))
    .filter(Boolean) as IProductItem[];

  const handleViewProduct = (id: string) => {
    router.push(paths.dashboard.product.details(id));
  };

  const handleAddToCart = (product: IProductItem) => {
    addToCart(product, 1);
    toast.success('Added to cart!');
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <CustomBreadcrumbs
        heading="Compare Products"
        links={[{ name: 'Home', href: paths.dashboard.root }, { name: 'Compare' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {compareProducts.length === 0 ? (
        <EmptyContent
          title="Nothing to compare yet"
          description="Pick a few products and hit “Compare” to see them side by side."
          sx={{ py: 15 }}
        />
      ) : (
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 160 }} />
                {compareProducts.map((product) => (
                  <TableCell key={product.id} align="center" sx={{ minWidth: 220, position: 'relative' }}>
                    <IconButton
                      size="small"
                      onClick={() => toggleCompare(product.id)}
                      sx={{ position: 'absolute', top: 4, right: 4 }}
                    >
                      <Iconify icon="mingcute:close-line" width={16} />
                    </IconButton>

                    <Avatar
                      variant="rounded"
                      src={product.coverUrl}
                      alt={product.name}
                      onClick={() => handleViewProduct(product.id)}
                      sx={{ width: 96, height: 96, mx: 'auto', mb: 1, cursor: 'pointer' }}
                    />
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => handleViewProduct(product.id)}
                      sx={{ typography: 'subtitle2', textTransform: 'none' }}
                    >
                      {product.name}
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell sx={{ typography: 'subtitle2' }}>Price</TableCell>
                {compareProducts.map((product) => (
                  <TableCell key={product.id} align="center">
                    {fEth(product.price)} ETH
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell sx={{ typography: 'subtitle2' }}>Category</TableCell>
                {compareProducts.map((product) => (
                  <TableCell key={product.id} align="center">
                    {product.category}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell sx={{ typography: 'subtitle2' }}>Gender</TableCell>
                {compareProducts.map((product) => (
                  <TableCell key={product.id} align="center">
                    {product.gender?.join(', ') || '—'}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell sx={{ typography: 'subtitle2' }}>Colors</TableCell>
                {compareProducts.map((product) => (
                  <TableCell key={product.id} align="center">
                    <ColorPreview colors={product.colors} sx={{ justifyContent: 'center' }} />
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell sx={{ typography: 'subtitle2' }}>Sizes</TableCell>
                {compareProducts.map((product) => (
                  <TableCell key={product.id} align="center">
                    {product.sizes?.join(', ') || '—'}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell sx={{ typography: 'subtitle2' }}>Stock</TableCell>
                {compareProducts.map((product) => (
                  <TableCell key={product.id} align="center">
                    {product.available} available
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell sx={{ typography: 'subtitle2' }}>Rating</TableCell>
                {compareProducts.map((product) => (
                  <TableCell key={product.id} align="center">
                    {product.totalRatings ? `${product.totalRatings.toFixed(1)} / 5` : '—'}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell />
                {compareProducts.map((product) => (
                  <TableCell key={product.id} align="center">
                    <Button
                      size="small"
                      variant="contained"
                      disabled={!product.available}
                      startIcon={<Iconify icon="solar:cart-plus-bold" />}
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to cart
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
