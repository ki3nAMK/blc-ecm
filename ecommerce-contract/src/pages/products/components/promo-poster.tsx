import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Image } from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export type PromoPosterItem = {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  href: string;
};

type Props = BoxProps & {
  list: PromoPosterItem[];
};

export function PromoPoster({ list, sx, ...other }: Props) {
  if (!list.length) return null;

  return (
    <MotionViewport>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: `repeat(${list.length}, 1fr)` },
          ...sx,
        }}
        {...other}
      >
        {list.map((item) => (
          <m.div key={item.id} variants={varFade({ distance: 24 }).inUp}>
            <PosterCard item={item} />
          </m.div>
        ))}
      </Box>
    </MotionViewport>
  );
}

// ----------------------------------------------------------------------

function PosterCard({ item }: { item: PromoPosterItem }) {
  return (
    <Link
      component={RouterLink}
      href={item.href}
      underline="none"
      sx={{
        display: 'block',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        transition: (theme) => theme.transitions.create(['transform', 'box-shadow']),
        '&:hover': {
          transform: 'translateY(-6px) scale(1.02)',
          boxShadow: 8,
        },
      }}
    >
      <Box
        sx={{
          p: 2.5,
          gap: 0.5,
          width: 1,
          bottom: 0,
          zIndex: 9,
          display: 'flex',
          position: 'absolute',
          color: 'common.white',
          flexDirection: 'column',
        }}
      >
        <Typography variant="overline" sx={{ opacity: 0.8 }}>
          {item.title}
        </Typography>
        <Typography variant="subtitle2" noWrap>
          {item.description}
        </Typography>
      </Box>

      <Image
        alt={item.title}
        src={item.coverUrl}
        ratio="4/3"
        slotProps={{
          overlay: {
            background: (theme) =>
              `linear-gradient(to bottom, ${varAlpha(theme.vars.palette.common.blackChannel, 0)} 0%, ${theme.vars.palette.common.black} 90%)`,
          },
        }}
      />
    </Link>
  );
}
