'use client';

import type { IProductItem } from '@/types/product';

import type { IBlogPost } from 'src/types/blog-post';

import { get } from 'lodash';
import { format } from 'date-fns';
import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, useEffect } from 'react';
import { useProducts } from '@/states/products';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Unstable_Grid2';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';

import blogService from '@/lib/service/blog.service';
import shopService from '@/lib/service/shop.service';
import { fEth, fShortenNumber } from 'src/utils/format-number';
import { getEffectiveFlashSale } from 'src/utils/flash-sale';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CountdownTimer } from 'src/components/countdown';
import { EmptyContent } from 'src/components/empty-content';
import { varFade, MotionViewport } from 'src/components/animate';
import { BecomeAffiliateCta } from 'src/components/referral-link/become-affiliate-cta';

import HeroCarousel from './components/hero-carousel';
import { AppFeatured } from './components/app-featured';
import { PromoPoster } from './components/promo-poster';
import { EcommerceNewProducts } from './components/ecommerce-new-product';
import { EcommerceLatestProducts } from './components/ecommerce-latest-products';
import { ProductCard } from './components/product-card';
import { EthPriceChart } from './components/eth-price-chart';

// ----------------------------------------------------------------------

const PRICE_RANGE = [0, 5];
const CATEGORIES = ['Shoes', 'Accessories', 'Apparel'];
const PRODUCTS_PER_PAGE = 12;

// `inventoryType` is never set by the backend — derive it from real stock levels so the
// Stock filter, "Low Stock" chip, and "Out of Stock" overlay all have something to match.
function getInventoryType(product: IProductItem): string {
    if (!product.available) return 'out of stock';
    if (product.quantity > 0 && product.available / product.quantity <= 0.2) return 'low stock';
    return 'in stock';
}

export default function EcommerceHomeView() {
    const router = useRouter();
    const { t } = useTranslation();
    // const { products, productsLoading } = useGetProducts();
    const { products, loading: productsLoading } = useProducts();

    const [category, setCategory] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<number[]>(PRICE_RANGE);
    const [stockFilter, setStockFilter] = useState<string>('all');
    const [page, setPage] = useState(1);

    const publishedProducts = useMemo(() => {
        const items = get(products, 'data', []) as IProductItem[];
        return items.map((p) => ({ ...p, inventoryType: getInventoryType(p) }));
    }, [products]);

    const filteredProducts = useMemo(() => {
        let filtered = publishedProducts;

        if (category !== 'all') {
            filtered = filtered.filter((p) => p.category === category);
        }

        filtered = filtered.filter(
            (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        if (stockFilter !== 'all') {
            filtered = filtered.filter((p) => p.inventoryType === stockFilter);
        }

        return filtered;
    }, [publishedProducts, category, priceRange, stockFilter]);

    // Jump back to page 1 whenever the filters change the result set.
    useEffect(() => {
        setPage(1);
    }, [category, priceRange, stockFilter]);

    const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));

    const paginatedProducts = filteredProducts.slice(
        (page - 1) * PRODUCTS_PER_PAGE,
        page * PRODUCTS_PER_PAGE
    );

    // Sản phẩm nổi bật (giá cao nhất)
    const featuredProducts = [...filteredProducts]
        .sort((a, b) => b.price - a.price)
        .slice(0, 3);

    // Sản phẩm mới (theo createdAt)
    const newArrivals = [...filteredProducts]
        .slice(0, 6);

    const featuredCarouselList = featuredProducts.map((product) => ({
        id: product.id,
        title: product.name,
        coverUrl: product.coverUrl,
        description: product.subDescription || product.description || '',
    }));

    const newProductsCarouselList = newArrivals.slice(0, 5).map((product) => ({
        id: product.id,
        name: product.name,
        coverUrl: product.coverUrl,
    }));

    const latestProductsList = [...publishedProducts]
        .sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime())
        .slice(0, 5)
        .map((product) => ({
            id: product.id,
            name: product.name,
            coverUrl: product.coverUrl,
            price: product.price,
            priceSale: product.priceSale ?? 0,
            colors: product.colors,
            flashSale: product.flashSale,
        }));

    const handleViewProduct = (id: string) => {
        router.push(paths.dashboard.product.details(id));
    };

    const { data: latestBlogResp } = useQuery({
        queryKey: ['blog-latest'],
        queryFn: () => blogService.getList(1, 3),
    });
    const latestPosts = get(latestBlogResp, 'data', []) as IBlogPost[];

    const { data: trustedShops = [] } = useQuery({
        queryKey: ['shops-top'],
        queryFn: () => shopService.getTopShops(4),
    });

    const flashSaleProducts = publishedProducts.filter((p) => getEffectiveFlashSale(p).isActive);

    const promoPosterList = CATEGORIES.map((cat) => {
        const sample = publishedProducts.find((p) => p.category === cat);
        return {
            id: cat,
            title: cat,
            description: `Shop the latest in ${cat}`,
            coverUrl: sample?.coverUrl || '',
            href: paths.dashboard.category.details(cat),
        };
    }).filter((item) => !!item.coverUrl);

    return (
        <Container sx={{ py: { xs: 4, md: 2 } }} maxWidth={"xxl" as any}>
            <Stack spacing={6}>
                <BecomeAffiliateCta />

                <Grid2 container spacing={3} sx={{
                    display: 'flex',      // cho container thành flex
                    alignItems: 'stretch', // kéo tất cả item bằng nhau
                }}
                >
                    <Grid2 xs={12} md={8}>
                        <HeroCarousel />
                    </Grid2>

                    {/* Cột phải: EcommerceNewProducts + Card mới */}
                    <Grid2 xs={12} md={4}>
                        <Stack spacing={3} sx={{ height: 665 }}>
                            {featuredCarouselList.length > 0 && <AppFeatured list={featuredCarouselList} />}

                            {newProductsCarouselList.length > 0 && (
                                <EcommerceNewProducts list={newProductsCarouselList} />
                            )}
                        </Stack>
                    </Grid2>
                </Grid2>

                {/* Trusted Shops */}
                {trustedShops.length > 0 && (
                    <Stack spacing={3} alignItems="center">
                        <Typography variant="h5" fontWeight={700}>
                            {t('home.trustedShops')}
                        </Typography>
                        <Grid container spacing={3} justifyContent="center">
                            {trustedShops.map((shop) => (
                                <Grid item xs={12} sm={6} md={3} key={shop.id}>
                                    <Card
                                        component={RouterLink}
                                        href={paths.dashboard.shop.details(shop.id)}
                                        sx={{
                                            p: 3,
                                            height: 1,
                                            display: 'block',
                                            textAlign: 'center',
                                            textDecoration: 'none',
                                            transition: 'transform .3s, box-shadow .3s',
                                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
                                        }}
                                    >
                                        <Stack spacing={1.5} alignItems="center">
                                            <Avatar src={shop.avatar} alt={shop.name} sx={{ width: 64, height: 64 }} />

                                            <Typography variant="subtitle1" noWrap sx={{ color: 'text.primary', maxWidth: 1 }}>
                                                {shop.name}
                                            </Typography>

                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <Rating value={shop.avgRating} precision={0.1} size="small" readOnly />
                                                <Typography variant="caption" color="text.secondary">
                                                    ({fShortenNumber(shop.totalReviews)})
                                                </Typography>
                                            </Stack>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    fontStyle: 'italic',
                                                    display: '-webkit-box',
                                                    overflow: 'hidden',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 2,
                                                }}
                                            >
                                                &ldquo;{shop.shopDescription || t('home.trustedShopsQuoteFallback')}&rdquo;
                                            </Typography>

                                            <Typography variant="caption" color="text.disabled">
                                                {shop.totalProducts} products · {fShortenNumber(shop.totalSold)} sold
                                            </Typography>
                                        </Stack>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                )}

                {flashSaleProducts.length > 0 && (
                    <Container maxWidth="xl">
                        <MotionViewport>
                            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                                <Iconify icon="solar:fire-bold" width={28} sx={{ color: 'error.main' }} />
                                <Typography variant="h5" fontWeight={700}>
                                    {t('home.flashSale')}
                                </Typography>
                            </Stack>

                            <Grid container spacing={3}>
                                {flashSaleProducts.map((product) => {
                                    const flashSale = getEffectiveFlashSale(product);
                                    return (
                                        <Grid item xs={12} sm={6} md={3} key={product.id}>
                                            <m.div variants={varFade({ distance: 24 }).inUp}>
                                                <Card
                                                    component={RouterLink}
                                                    href={paths.dashboard.product.details(product.id)}
                                                    sx={{
                                                        textDecoration: 'none',
                                                        transition: 'transform .3s, box-shadow .3s',
                                                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
                                                    }}
                                                >
                                                    <Box sx={{ position: 'relative' }}>
                                                        <CardMedia
                                                            component="img"
                                                            height={180}
                                                            image={product.coverUrl}
                                                            alt={product.name}
                                                        />
                                                        <Label
                                                            color="error"
                                                            variant="filled"
                                                            sx={{ position: 'absolute', top: 12, left: 12 }}
                                                        >
                                                            FLASH SALE
                                                        </Label>
                                                    </Box>
                                                    <CardContent>
                                                        <Typography variant="subtitle1" sx={{ color: 'text.primary', mb: 1 }} noWrap>
                                                            {product.name}
                                                        </Typography>
                                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
                                                            >
                                                                {fEth(product.price)}
                                                            </Typography>
                                                            <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                                                                {fEth(flashSale.discountedPrice)}
                                                            </Typography>
                                                        </Stack>
                                                        {flashSale.endTime && <CountdownTimer endTime={flashSale.endTime} />}
                                                    </CardContent>
                                                </Card>
                                            </m.div>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </MotionViewport>
                    </Container>
                )}

                {promoPosterList.length > 0 && (
                    <Container maxWidth="xl">
                        <PromoPoster list={promoPosterList} />
                    </Container>
                )}

                {/* Filters & Product Grid */}
                <Container maxWidth="xl">
                    <Grid container spacing={4}>
                        {/* Sidebar Filters */}
                        <Grid item xs={12} md={3}>
                            <Box sx={{ position: 'sticky', top: 80 }}>
                                <Card sx={{ p: 3, mb: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {t('home.filters')}
                                    </Typography>
                                    <Divider sx={{ mb: 3 }} />

                                    {/* Category */}
                                    <FormControl fullWidth sx={{ mb: 3 }}>
                                        <InputLabel>{t('home.category')}</InputLabel>
                                        <Select value={category} onChange={(e) => setCategory(e.target.value)} label={t('home.category')}>
                                            <MenuItem value="all">{t('home.allCategories')}</MenuItem>
                                            {CATEGORIES.map((cat) => (
                                                <MenuItem key={cat} value={cat}>
                                                    {cat}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    {/* Price Range */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography gutterBottom>{t('home.priceRange')}</Typography>
                                        <Slider
                                            value={priceRange}
                                            onChange={(_, newValue) => setPriceRange(newValue as number[])}
                                            valueLabelDisplay="auto"
                                            min={PRICE_RANGE[0]}
                                            max={PRICE_RANGE[1]}
                                            step={0.05}
                                        />
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="caption">{priceRange[0]} ETH</Typography>
                                            <Typography variant="caption">{priceRange[1]} ETH</Typography>
                                        </Stack>
                                    </Box>

                                    {/* Stock Status */}
                                    <FormControl fullWidth>
                                        <InputLabel>{t('home.stock')}</InputLabel>
                                        <Select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} label={t('home.stock')}>
                                            <MenuItem value="all">All</MenuItem>
                                            {PRODUCT_STOCK_OPTIONS.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        sx={{ mt: 3 }}
                                        onClick={() => {
                                            setCategory('all');
                                            setPriceRange(PRICE_RANGE);
                                            setStockFilter('all');
                                        }}
                                    >
                                        {t('home.clearFilters')}
                                    </Button>
                                </Card>

                                {latestProductsList.length > 0 && (
                                    <Card sx={{ p: 0 }}>
                                        <EcommerceLatestProducts
                                            title={t('home.latestProducts')}
                                            list={latestProductsList}
                                            onItemClick={handleViewProduct}
                                        />
                                    </Card>
                                )}

                            </Box>

                        </Grid>

                        {/* Product Grid */}
                        <Grid item xs={12} md={9}>
                            <Stack spacing={4}>
                                {/* Featured Products */}
                                {featuredProducts.length > 0 && (
                                    <>
                                        <Typography variant="h5" fontWeight={700}>
                                            {t('home.featuredProducts')}
                                        </Typography>
                                        <Grid container spacing={3}>
                                            {featuredProducts.map((product) => (
                                                <Grid item xs={12} sm={6} md={4} key={product.id}>
                                                    <ProductCard product={product} onView={handleViewProduct} isFeatured />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </>
                                )}

                                <Divider />

                                {/* All Products */}
                                <Typography variant="h5" fontWeight={700}>
                                    {t('home.allProducts', { count: filteredProducts.length })}
                                </Typography>

                                {productsLoading ? (
                                    <EmptyContent title="Loading products..." />
                                ) : filteredProducts.length === 0 ? (
                                    <EmptyContent title="No products found" />
                                ) : (
                                    <>
                                        <Grid container spacing={3}>
                                            {paginatedProducts.map((product) => (
                                                <Grid item xs={12} sm={6} md={4} key={product.id}>
                                                    <ProductCard product={product} onView={handleViewProduct} />
                                                </Grid>
                                            ))}
                                        </Grid>

                                        {pageCount > 1 && (
                                            <Stack alignItems="center" sx={{ pt: 2 }}>
                                                <Pagination
                                                    count={pageCount}
                                                    page={page}
                                                    onChange={(_, newPage) => setPage(newPage)}
                                                    color="primary"
                                                />
                                            </Stack>
                                        )}
                                    </>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>

                {/* New Arrivals */}
                <Container maxWidth="xl" >
                    {newArrivals.length > 0 && (
                        <>
                            <Divider />
                            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mt: 2 }}>
                                {t('home.newArrivals')}
                            </Typography>
                            <Grid container spacing={3}>
                                {newArrivals.map((product) => (
                                    <Grid item xs={12} sm={6} md={3} key={product.id}>
                                        <ProductCard product={product} onView={handleViewProduct} compact />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                </Container>

                {/* Latest from the Blog */}
                {latestPosts.length > 0 && (
                    <Container maxWidth="xl">
                        <Divider sx={{ mb: 5 }} />
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                            <Typography variant="h5" fontWeight={700}>
                                {t('home.latestFromBlog')}
                            </Typography>
                            <Button
                                component={RouterLink}
                                href={paths.dashboard.blog.root}
                                endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                            >
                                {t('home.viewAll')}
                            </Button>
                        </Stack>
                        <Grid container spacing={3}>
                            {latestPosts.map((post) => (
                                <Grid item xs={12} sm={6} md={4} key={post.id}>
                                    <Card
                                        component={RouterLink}
                                        href={paths.dashboard.blog.details(post.slug)}
                                        sx={{
                                            textDecoration: 'none',
                                            transition: 'transform .3s, box-shadow .3s',
                                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height={180}
                                            image={post.coverUrl || `https://picsum.photos/seed/${post.slug}/640/480`}
                                            alt={post.title}
                                            onError={(event) => {
                                                (event.target as HTMLImageElement).src = `https://picsum.photos/seed/${post.slug}/640/480`;
                                            }}
                                        />
                                        <CardContent>
                                            {post.tags?.length > 0 && (
                                                <Stack direction="row" spacing={0.75} sx={{ mb: 1 }}>
                                                    <Label variant="soft">{post.tags[0]}</Label>
                                                </Stack>
                                            )}
                                            <Typography variant="subtitle1" sx={{ color: 'text.primary', mb: 1 }} noWrap>
                                                {post.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    display: '-webkit-box',
                                                    overflow: 'hidden',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 2,
                                                }}
                                            >
                                                {post.excerpt}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                )}

                <Container maxWidth="xl">
                    <Divider sx={{ mb: 5 }} />
                    <EthPriceChart />
                </Container>
            </Stack >
        </Container >
    );
}

