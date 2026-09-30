import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useAuthContext } from '@/auth/hooks';

import { fShortenNumber } from 'src/utils/format-number';

import shopService from '@/lib/service/shop.service';
import productService from '@/lib/service/product.service';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

type FormValues = {
  shopBanner: File | string | null;
  shopDescription: string;
};

export function SellerShopProfileView() {
  const { user } = useAuthContext();

  const { data: shop, isLoading, refetch } = useQuery({
    queryKey: ['shop-detail', user?.id],
    queryFn: () => shopService.getDetail(user!.id),
    enabled: !!user?.id,
  });

  const methods = useForm<FormValues>({
    defaultValues: { shopBanner: null, shopDescription: '' },
  });

  const { reset, handleSubmit, formState: { isSubmitting } } = methods;

  useEffect(() => {
    if (shop) {
      reset({
        shopBanner: shop.shopBanner,
        shopDescription: shop.shopDescription ?? '',
      });
    }
  }, [shop, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const shopBanner =
        data.shopBanner instanceof File
          ? (await productService.uploadImage(data.shopBanner)).url
          : data.shopBanner ?? undefined;

      await shopService.updateMyShop({
        shopBanner,
        shopDescription: data.shopDescription,
      });

      toast.success('Shop profile updated!');
      refetch();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update shop profile');
    }
  });

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <CustomBreadcrumbs
        heading="Shop Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.seller.general },
          { name: 'Shop Profile' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {isLoading ? (
        <EmptyContent title="Loading shop profile..." />
      ) : (
        <Form methods={methods} onSubmit={onSubmit}>
          <Card sx={{ p: 3 }}>
            <CardHeader title="Public shop info" sx={{ p: 0, mb: 3 }} />

            {shop && (
              <Stack direction="row" spacing={3} sx={{ mb: 3, typography: 'body2', color: 'text.secondary' }}>
                <span>{shop.totalProducts} products</span>
                <span>{fShortenNumber(shop.totalSold)} sold</span>
                <span>{shop.avgRating.toFixed(1)} ★ ({fShortenNumber(shop.totalReviews)} reviews)</span>
              </Stack>
            )}

            <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

            <Stack spacing={3}>
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Shop banner</Typography>
                <Field.Upload name="shopBanner" maxSize={3145728} onDelete={() => methods.setValue('shopBanner', null)} />
              </Stack>

              <Field.Text
                name="shopDescription"
                label="Shop description"
                multiline
                rows={4}
                placeholder="Tell buyers what your shop is about..."
              />
            </Stack>

            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          </Card>
        </Form>
      )}
    </Container>
  );
}
