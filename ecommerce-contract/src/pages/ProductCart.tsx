'use client';

import { useMemo } from 'react';
import { useCart } from '@/states/carts';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import Grid2 from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { RenderCellPrice, RenderCellPriceByPrice } from './products/components/product-table-row';
import { useProducts } from '@/states/products';
import { toast } from 'sonner';
import { getStoredReferralCode } from 'src/hooks/use-capture-referral';


// ----------------------------------------------------------------------

export default function EcommerceCartView() {
    const router = useRouter();
    const { createOrder, creatingOrder } = useProducts();

    const {
        cartItems: cart,
        clearCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
    } = useCart();

    // ✅ Tính tổng tiền
    const total = useMemo(
        () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cart],
    );

    const handleCheckout = async () => {
        const referralCode = getStoredReferralCode();

        const payload = {
            items: cart.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
            })),
            ...(referralCode ? { referralCode } : {}),
        };

        await createOrder(payload, {
            onSuccess: () => {
                clearCart();
                toast.success("Create order success!");
                router.push(paths.dashboard.user.order.root);
            },
            onError: (err) => {
                console.error(err);
                toast.error("Create order fail!");
                alert('Tạo đơn hàng thất bại!');
            },
        });
    };


    // ✅ EMPTY CART
    if (cart.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <EmptyContent
                    title="Your cart is empty"
                    description="Looks like you haven't added anything to your cart yet."
                    filled
                    action={
                        <Button
                            component={RouterLink}
                            href={paths.dashboard.root}
                            variant="contained"
                            size="large"
                            startIcon={
                                <Iconify icon="mingcute:shopping-bag-2-line" />
                            }
                        >
                            Continue Shopping
                        </Button>
                    }
                />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
            <Typography variant="h3" sx={{ mb: 4 }}>
                Shopping Cart ({cart.length}{' '}
                {cart.length > 1 ? 'items' : 'item'})
            </Typography>

            <Grid2 container spacing={4}>
                {/* ✅ DANH SÁCH SẢN PHẨM */}
                <Grid2 xs={12} lg={8}>
                    <Stack spacing={3}>
                        {cart.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onIncrease={increaseQty}
                                onDecrease={decreaseQty}
                                onRemove={removeFromCart}
                            />
                        ))}
                    </Stack>

                    <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            component={RouterLink}
                            href={paths.dashboard.root}
                            startIcon={
                                <Iconify icon="mingcute:arrow-left-line" />
                            }
                            variant="outlined"
                        >
                            Continue Shopping
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={
                                <Iconify icon="mingcute:delete-2-line" />
                            }
                            onClick={clearCart}
                        >
                            Clear Cart
                        </Button>
                    </Box>
                </Grid2>

                {/* ✅ TÓM TẮT ĐƠN HÀNG */}
                <Grid2 xs={12} lg={4}>
                    <Card sx={{ position: 'sticky', top: 100 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Order Summary
                            </Typography>

                            <Stack spacing={2} sx={{ my: 3 }}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                >
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Subtotal
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {total.toFixed(2)}
                                    </Typography>
                                </Stack>

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                >
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Shipping
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="success.main"
                                    >
                                        Free
                                    </Typography>
                                </Stack>

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                >
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Tax
                                    </Typography>
                                    <Typography variant="body2">
                                        ${(total * 0.1).toFixed(2)}
                                    </Typography>
                                </Stack>

                                <Divider />

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                >
                                    <Typography variant="h6">Total</Typography>
                                    <Typography variant="h6" color="primary">
                                        {(total * 1.1).toFixed(2)}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <TextField
                                fullWidth
                                placeholder="Enter promo code"
                                size="small"
                                sx={{ mb: 2 }}
                                InputProps={{
                                    endAdornment: (
                                        <Button variant="contained" size="small">
                                            Apply
                                        </Button>
                                    ),
                                }}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleCheckout}
                                disabled={creatingOrder}
                                startIcon={
                                    creatingOrder ? null : (
                                        <Iconify icon="mingcute:shopping-bag-2-fill" />
                                    )
                                }
                            >
                                {creatingOrder ? 'Processing...' : 'Proceed to Checkout'}
                            </Button>


                            <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="center"
                                sx={{ mt: 2 }}
                            >
                                <Iconify
                                    icon="mingcute:shield-fill"
                                    color="success.main"
                                />
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Secure checkout. 30-day returns.
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </Container>
    );
}

// ----------------------------------------------------------------------

interface CartItemProps {
    item: any;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
}

function CartItem({
    item,
    onIncrease,
    onDecrease,
    onRemove,
}: CartItemProps) {
    const isOutOfStock =
        item.inventoryType === 'out of stock';

    return (
        <Card
            sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                gap: 3,
                position: 'relative',
                opacity: isOutOfStock ? 0.6 : 1,
                transition: 'all 0.2s',
                '&:hover': { boxShadow: 6 },
            }}
        >
            {/* ✅ IMAGE */}
            <Box
                sx={{
                    position: 'relative',
                    width: 120,
                    height: 120,
                    flexShrink: 0,
                }}
            >
                <CardMedia
                    component="img"
                    image={item.coverUrl}
                    alt={item.name}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 2,
                    }}
                />
            </Box>

            {/* ✅ CONTENT */}
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                    {item.name}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1}>
                    {/* <Typography variant="h6" color="primary">
                        ${item.price}
                    </Typography> */}
                    <RenderCellPrice params={{ row: item } as any} />
                    {item.inventoryType === 'low stock' && (
                        <Chip
                            label="Low Stock"
                            color="warning"
                            size="small"
                        />
                    )}
                </Stack>

                {/* ✅ QUANTITY */}
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mt: 2 }}
                >
                    <IconButton
                        onClick={() => onDecrease(item.id)}
                        disabled={item.quantity <= 1}
                    >
                        <Iconify icon="majesticons:minus-line" />
                    </IconButton>

                    <TextField
                        value={item.quantity}
                        size="small"
                        sx={{ width: 60 }}
                        inputProps={{
                            min: 1,
                            style: { textAlign: 'center' },
                        }}
                        disabled
                    />

                    <IconButton onClick={() => onIncrease(item.id)}>
                        <Iconify icon="mingcute:add-line" />
                    </IconButton>

                    {/* <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                    >
                        ${item.price * item.quantity}
                    </Typography> */}
                    <RenderCellPriceByPrice params={{ price: item.price * item.quantity }} />
                </Stack>
            </Box>

            {/* ✅ REMOVE */}
            <IconButton
                color="error"
                onClick={() => onRemove(item.id)}
                sx={{ position: 'absolute', top: 8, right: 8 }}
            >
                <Iconify icon="mingcute:close-line" />
            </IconButton>
        </Card>
    );
}
