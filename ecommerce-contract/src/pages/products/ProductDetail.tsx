import type { IProductItem } from 'src/types/product';

import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import LegacyGrid from '@mui/material/Grid';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useTabs } from 'src/hooks/use-tabs';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import productService from '@/lib/service/product.service';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { ProductCard } from './components/product-card';
import { ProductDetailsSkeleton } from './components/product-skeleton';
import { ProductDetailsReview } from './components/product-details-review';
import { ProductDetailsSummary } from './components/product-details-summary';
import { ProductDetailsCarousel } from './components/product-details-carousel';
import { ProductDetailsDescription } from './components/product-details-description';

// ----------------------------------------------------------------------

const SUMMARY = [
    {
        title: '100% original',
        description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
        icon: 'solar:verified-check-bold',
    },
    {
        title: '10 days replacement',
        description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
        icon: 'solar:clock-circle-bold',
    },
    {
        title: 'Year warranty',
        description: 'Cotton candy gingerbread cake I love sugar sweet.',
        icon: 'solar:shield-check-bold',
    },
];

// ----------------------------------------------------------------------

function computeRatingBreakdown(reviews: IProductItem['reviews'] = []) {
    // ascending order (1→5): ProductDetailsReview reverses this list before rendering,
    // so 5-star ends up on top.
    return [1, 2, 3, 4, 5].map((star) => ({
        name: `${star} Star`,
        starCount: star,
        reviewCount: reviews.filter((r) => Math.round(r.rating) === star).length,
    }));
}

type Props = {
    product?: IProductItem;
    loading?: boolean;
    error?: any;
};

export function ProductDetailsView({ product, error, loading }: Props) {
    const tabs = useTabs('description');
    const router = useRouter();

    const [publish, setPublish] = useState('');

    const seller = typeof product?.sellerId === 'object' ? product.sellerId : null;
    const sellerId = seller?.id;

    const { data: relatedResp } = useQuery({
        queryKey: ['related-products', product?.category],
        queryFn: () => productService.getByCategory(product!.category, 1, 8),
        enabled: !!product?.category,
    });

    const relatedProducts = (get(relatedResp, 'data', []) as IProductItem[]).filter(
        (p) => p.id !== product?.id
    );

    const { data: shopProductsResp } = useQuery({
        queryKey: ['shop-products', sellerId],
        queryFn: () => productService.getBySeller(sellerId!, 1, 8),
        enabled: !!sellerId,
    });

    const shopProducts = (get(shopProductsResp, 'data', []) as IProductItem[]).filter(
        (p) => p.id !== product?.id
    );

    const handleViewProduct = (id: string) => {
        router.push(paths.dashboard.product.details(id));
    };

    useEffect(() => {
        if (product) {
            setPublish(product?.publish);
        }
    }, [product]);

    const handleChangePublish = useCallback((newValue: string) => {
        setPublish(newValue);
    }, []);

    if (loading) {
        return (
            <DashboardContent sx={{ pt: 5 }}>
                <ProductDetailsSkeleton />
            </DashboardContent>
        );
    }

    if (error) {
        return (
            <DashboardContent sx={{ pt: 5 }}>
                <EmptyContent
                    filled
                    title="Product not found!"
                    action={
                        <Button
                            component={RouterLink}
                            href={paths.dashboard.root}
                            startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
                            sx={{ mt: 3 }}
                        >
                            Back to list
                        </Button>
                    }
                    sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
                />
            </DashboardContent>
        );
    }

    return (
        <DashboardContent>
            <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
                <Grid xs={12} md={6} lg={7}>
                    <ProductDetailsCarousel images={product?.images ?? []} />
                </Grid>

                <Grid xs={12} md={6} lg={5}>
                    {product && <ProductDetailsSummary disableActions product={product} />}
                </Grid>
            </Grid>

            <Box
                gap={5}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
                sx={{ my: 10 }}
            >
                {SUMMARY.map((item) => (
                    <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
                        <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />

                        <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
                            {item.title}
                        </Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {item.description}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <Card>
                <Tabs
                    value={tabs.value}
                    onChange={tabs.onChange}
                    sx={{
                        px: 3,
                        boxShadow: (theme) =>
                            `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
                    }}
                >
                    {[
                        { value: 'description', label: 'Description' },
                        { value: 'reviews', label: `Reviews (${product?.reviews.length})` },
                    ].map((tab) => (
                        <Tab key={tab.value} value={tab.value} label={tab.label} />
                    ))}
                </Tabs>

                {tabs.value === 'description' && (
                    <ProductDetailsDescription description={product?.description ?? ''} />
                )}

                {tabs.value === 'reviews' && (
                    <ProductDetailsReview
                        productId={product?.id ?? ''}
                        ratings={computeRatingBreakdown(product?.reviews)}
                        reviews={product?.reviews ?? []}
                        totalRatings={product?.totalRatings ?? 0}
                        totalReviews={product?.totalReviews ?? 0}
                    />
                )}
            </Card>

            {shopProducts.length > 0 && (
                <>
                    <Divider sx={{ mt: 8, mb: 5 }} />

                    <Typography variant="h5" sx={{ mb: 3 }}>
                        More from {seller?.name ?? 'this shop'}
                    </Typography>

                    <LegacyGrid container spacing={3}>
                        {shopProducts.slice(0, 4).map((item) => (
                            <LegacyGrid item xs={12} sm={6} md={3} key={item.id}>
                                <ProductCard product={item} onView={handleViewProduct} compact />
                            </LegacyGrid>
                        ))}
                    </LegacyGrid>
                </>
            )}

            {relatedProducts.length > 0 && (
                <>
                    <Divider sx={{ mt: 8, mb: 5 }} />

                    <Typography variant="h5" sx={{ mb: 3 }}>
                        Related products
                    </Typography>

                    <LegacyGrid container spacing={3}>
                        {relatedProducts.slice(0, 4).map((item) => (
                            <LegacyGrid item xs={12} sm={6} md={3} key={item.id}>
                                <ProductCard product={item} onView={handleViewProduct} compact />
                            </LegacyGrid>
                        ))}
                    </LegacyGrid>
                </>
            )}
        </DashboardContent>
    );
}
