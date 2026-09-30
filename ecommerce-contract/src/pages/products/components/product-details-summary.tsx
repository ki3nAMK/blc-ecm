import type { IProductItem } from 'src/types/product';
import type { ICheckoutItem } from 'src/types/checkout';

import { toast } from 'sonner';
import { useCart } from '@/states/carts';
import { useCompare } from '@/states/compare';
import { useAuthContext } from '@/auth/hooks';
import { useFavorites } from '@/states/favorites';
import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { useBoolean } from 'src/hooks/use-boolean';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { fEth, fShortenNumber } from 'src/utils/format-number';
import { getEffectiveFlashSale } from 'src/utils/flash-sale';

import messageService from '@/lib/service/message.service';
import { Label } from 'src/components/label';
import { CountdownTimer } from 'src/components/countdown';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ColorPicker } from 'src/components/color-utils';

import { IncrementerButton } from './incrementer-button';
import { SizeChartDialog, getSizeChartType } from './size-chart-dialog';


// ----------------------------------------------------------------------

type Props = {
  product: IProductItem;
  items?: ICheckoutItem[];
  disableActions?: boolean;
  onGotoStep?: (step: number) => void;
  onAddCart?: (cartItem: ICheckoutItem) => void;
};

export function ProductDetailsSummary({
  items,
  product,
  onAddCart,
  onGotoStep,
  disableActions,
  ...other
}: Props) {
  const router = useRouter();
  const { authenticated, user } = useAuthContext();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isComparing, toggleCompare } = useCompare();
  const sizeChart = useBoolean();
  const [startingChat, setStartingChat] = useState(false);

  const {
    id,
    name,
    sizes,
    price,
    coverUrl,
    colors,
    newLabel,
    available,
    priceSale,
    saleLabel,
    sellerId,
    totalRatings,
    totalReviews,
    inventoryType,
    subDescription,
  } = product;

  const seller = typeof sellerId === 'object' ? sellerId : null;

  const existProduct = !!items?.length && items.map((item) => item.id).includes(id);

  const isMaxQuantity =
    !!items?.length &&
    items.filter((item) => item.id === id).map((item) => item.quantity)[0] >= available;

  const defaultValues = {
    id,
    name,
    coverUrl,
    available,
    price,
    colors: colors[0],
    size: sizes[4],
    quantity: available < 1 ? 0 : 1,
  };

  const methods = useForm({ defaultValues });

  const { reset, watch, control, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!existProduct) {
        // onAddCart?.({ ...data, colors: [values.colors], subtotal: data.price * data.quantity });
        addToCart?.(product, data.quantity)
        toast.success('Add to cart successful!');
      }
      router.push(paths.dashboard.product.cart);
    } catch (error) {
      console.error(error);
    }
  });

  const handleAddCart = useCallback(() => {
    try {
      addToCart?.(product, values.quantity)
      toast.success('Add to cart successful!');
    } catch (error) {
      console.error(error);
    }
  }, [values, product]);

  const flashSale = getEffectiveFlashSale(product);

  const renderPrice = (
    <Stack spacing={0.5}>
      <Box sx={{ typography: 'h5', display: 'flex', alignItems: 'center' }}>
        {(flashSale.isActive || priceSale) && (
          <Box
            component="span"
            sx={{ color: 'text.disabled', textDecoration: 'line-through', mr: 0.5 }}
          >
            {fEth(flashSale.isActive ? price : priceSale)}
          </Box>
        )}

        <Box
          component="span"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: flashSale.isActive ? 'error.main' : undefined,
          }}
        >
          <span>{fEth(flashSale.isActive ? flashSale.discountedPrice : price)}</span>
          <Box
            component="img"
            src="/assets/eth.png"
            width={16}
            height={16}
            sx={{ display: 'block' }}
          />
        </Box>
      </Box>

      {flashSale.isActive && flashSale.endTime && (
        <Stack direction="row" spacing={1} alignItems="center">
          <Label color="error" variant="filled">
            FLASH SALE
          </Label>
          <CountdownTimer endTime={flashSale.endTime} />
        </Stack>
      )}
    </Stack>
  );

  const productIsFavorite = isFavorite(id);
  const productIsComparing = isComparing(id);

  const handleShare = useCallback(async () => {
    const shareData = { title: name, url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // user canceled the native share sheet — not an error worth surfacing
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  }, [name]);

  const renderShare = (
    <Stack direction="row" spacing={3} justifyContent="center">
      <Link
        variant="subtitle2"
        onClick={() => toggleCompare(id)}
        sx={{
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          color: productIsComparing ? 'primary.main' : 'text.secondary',
        }}
      >
        <Iconify
          icon={productIsComparing ? 'eva:checkmark-fill' : 'mingcute:add-line'}
          width={16}
          sx={{ mr: 1 }}
        />
        Compare
      </Link>

      <Link
        variant="subtitle2"
        onClick={() => toggleFavorite(id)}
        sx={{
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          color: productIsFavorite ? 'error.main' : 'text.secondary',
        }}
      >
        <Iconify
          icon={productIsFavorite ? 'solar:heart-bold' : 'solar:heart-linear'}
          width={16}
          sx={{ mr: 1 }}
        />
        Favorite
      </Link>

      <Link
        variant="subtitle2"
        onClick={handleShare}
        sx={{ cursor: 'pointer', color: 'text.secondary', display: 'inline-flex', alignItems: 'center' }}
      >
        <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
        Share
      </Link>
    </Stack>
  );

  const renderColorOptions = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Color
      </Typography>

      <Controller
        name="colors"
        control={control}
        render={({ field }) => (
          <ColorPicker
            colors={colors}
            selected={field.value}
            onSelectColor={(color) => field.onChange(color as string)}
            limit={4}
          />
        )}
      />
    </Stack>
  );

  const sizeChartType = getSizeChartType(sizes);

  const renderSizeOptions = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Size
      </Typography>

      <Field.Select
        name="size"
        size="small"
        helperText={
          sizeChartType !== 'none' && (
            <Link underline="always" color="textPrimary" onClick={sizeChart.onTrue} sx={{ cursor: 'pointer' }}>
              Size chart
            </Link>
          )
        }
        sx={{
          maxWidth: 88,
          [`& .${formHelperTextClasses.root}`]: { mx: 0, mt: 1, textAlign: 'right' },
        }}
      >
        {sizes.map((size) => (
          <MenuItem key={size} value={size}>
            {size}
          </MenuItem>
        ))}
      </Field.Select>
    </Stack>
  );

  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Quantity
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          quantity={values.quantity}
          disabledDecrease={values.quantity <= 1}
          disabledIncrease={values.quantity >= available}
          onIncrease={() => setValue('quantity', values.quantity + 1)}
          onDecrease={() => setValue('quantity', values.quantity - 1)}
        />

        <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
          Available: {available}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderActions = (
    <Stack direction="row" spacing={2}>
      <Button
        fullWidth
        disabled={isMaxQuantity || !authenticated}
        size="large"
        color="warning"
        variant="contained"
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        onClick={handleAddCart}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Add to cart
      </Button>

      <Button fullWidth size="large" type="submit" variant="contained" disabled={isMaxQuantity || !authenticated}>
        Buy now
      </Button>
    </Stack>
  );

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {subDescription}
    </Typography>
  );

  const isOwnProduct = authenticated && user?.id === seller?.id;

  const handleChat = useCallback(async () => {
    if (!seller) return;
    if (!authenticated) {
      toast.error('Please log in to chat with this shop');
      return;
    }
    setStartingChat(true);
    try {
      const conversation = await messageService.startConversation(seller.id);
      await messageService.sendMessage(conversation.id, { productId: id });
      router.push(paths.dashboard.messages.details(conversation.id));
    } catch (error) {
      toast.error('Failed to start conversation');
    } finally {
      setStartingChat(false);
    }
  }, [seller, authenticated, router, id]);

  const renderSeller = seller && (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Link
        component={RouterLink}
        href={paths.dashboard.shop.details(seller.id)}
        underline="hover"
        color="inherit"
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
      >
        <Avatar src={seller.avatar} alt={seller.name} sx={{ width: 24, height: 24 }} />
        <Typography variant="body2">Sold by {seller.name}</Typography>
      </Link>

      {!isOwnProduct && (
        <Button
          size="small"
          variant="outlined"
          startIcon={<Iconify icon="solar:chat-round-dots-bold-duotone" width={16} />}
          onClick={handleChat}
          disabled={startingChat}
        >
          Chat
        </Button>
      )}
    </Stack>
  );

  const renderRating = (
    <Stack direction="row" alignItems="center" sx={{ color: 'text.disabled', typography: 'body2' }}>
      <Rating size="small" value={totalRatings} precision={0.1} readOnly sx={{ mr: 1 }} />
      {`(${fShortenNumber(totalReviews)} reviews)`}
    </Stack>
  );

  const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
    <Stack direction="row" alignItems="center" spacing={1}>
      {newLabel.enabled && <Label color="info">{newLabel.content}</Label>}
      {saleLabel.enabled && <Label color="error">{saleLabel.content}</Label>}
    </Stack>
  );

  const renderInventoryType = (
    <Box
      component="span"
      sx={{
        typography: 'overline',
        color:
          (inventoryType === 'out of stock' && 'error.main') ||
          (inventoryType === 'low stock' && 'warning.main') ||
          'success.main',
      }}
    >
      {inventoryType}
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">
          {renderLabels}

          {renderInventoryType}

          <Typography variant="h5">{name}</Typography>

          {renderSeller}

          {renderRating}

          {renderPrice}

          {renderSubDescription}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderColorOptions}

        {renderSizeOptions}

        {renderQuantity}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderActions}

        {renderShare}
      </Stack>

      <SizeChartDialog
        open={sizeChart.value}
        onClose={sizeChart.onFalse}
        type={sizeChartType}
        currentSize={values.size}
      />
    </Form>
  );
}
