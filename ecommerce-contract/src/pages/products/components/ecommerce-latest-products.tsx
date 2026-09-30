import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';

import type { IDateValue } from 'src/types/common';

import { fEth } from 'src/utils/format-number';
import { getEffectiveFlashSale } from 'src/utils/flash-sale';

import { Scrollbar } from 'src/components/scrollbar';
import { ColorPreview } from 'src/components/color-utils';
import { CountdownTimer } from 'src/components/countdown';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: {
    id: string;
    name: string;
    coverUrl: string;
    price: number;
    priceSale: number;
    colors: string[];
    flashSale?: {
      discountedPrice: number;
      discountedEscrow: number;
      startTime: IDateValue;
      endTime: IDateValue;
      status: 'scheduled' | 'active' | 'expired' | 'canceled';
    } | null;
  }[];
  onItemClick?: (id: string) => void;
};

export function EcommerceLatestProducts({ title, subheader, list, onItemClick, ...other }: Props) {
  return (
    <>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar sx={{ minHeight: 384 }}>
        <Box
          sx={{
            p: 3,
            gap: 3,
            minWidth: 360,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {list.map((item) => (
            <Item key={item.id} item={item} onClick={() => onItemClick?.(item.id)} />
          ))}
        </Box>
      </Scrollbar>
    </>
  );
}

// ----------------------------------------------------------------------

type ItemProps = BoxProps & {
  item: Props['list'][number];
  onClick?: () => void;
};

function Item({ item, sx, onClick, ...other }: ItemProps) {
  const flashSale = getEffectiveFlashSale(item);

  return (
    <Box
      onClick={onClick}
      sx={{
        gap: 2,
        display: 'flex',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : undefined,
        ...sx,
      }}
      {...other}
    >
      <Avatar
        variant="rounded"
        alt={item.name}
        src={item.coverUrl}
        sx={{ width: 48, height: 48, flexShrink: 0 }}
      />

      <Box
        sx={{ gap: 0.5, minWidth: 0, display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
      >
        <Link
          noWrap
          onClick={onClick}
          sx={{ color: 'text.primary', typography: 'subtitle2', cursor: 'pointer' }}
        >
          {item.name}
        </Link>

        <Box
          sx={{
            gap: 0.5,
            display: 'flex',
            alignItems: 'center',
            typography: 'body2',
            color: 'text.secondary',
          }}
        >
          {(flashSale.isActive || !!item.priceSale) && (
            <Box component="span" sx={{ textDecoration: 'line-through' }}>
              {fEth(flashSale.isActive ? item.price : item.priceSale)}
            </Box>
          )}

          <Box
            component="span"
            sx={{
              gap: 0.5,
              display: 'inline-flex',
              alignItems: 'center',
              color: flashSale.isActive || item.priceSale ? 'error.main' : 'inherit',
            }}
          >
            {fEth(flashSale.isActive ? flashSale.discountedPrice : item.price)}
            <Box component="img" src="/assets/eth.png" width={12} height={12} />
          </Box>
        </Box>

        {flashSale.isActive && flashSale.endTime && <CountdownTimer endTime={flashSale.endTime} />}
      </Box>

      <ColorPreview limit={3} colors={item.colors} />
    </Box>
  );
}
