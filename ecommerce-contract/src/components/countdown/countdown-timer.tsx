import type { SxProps, Theme } from '@mui/material/styles';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = {
  endTime: string | number | Date;
  onExpire?: () => void;
  sx?: SxProps<Theme>;
};

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(endTime: string | number | Date): TimeLeft | null {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function CountdownTimer({ endTime, onExpire, sx }: Props) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(endTime));

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      const next = getTimeLeft(endTime);
      if (!next && prev) onExpire?.();
      return next;
    });
  }, [endTime, onExpire]);

  useEffect(() => {
    setTimeLeft(getTimeLeft(endTime));
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endTime, tick]);

  if (!timeLeft) {
    return (
      <Typography variant="caption" sx={{ color: 'text.disabled', ...sx }}>
        Sale ended
      </Typography>
    );
  }

  return (
    <Stack direction="row" spacing={0.5} alignItems="center" sx={sx}>
      {timeLeft.days > 0 && (
        <Box component="span" sx={{ typography: 'caption', fontWeight: 700 }}>
          {timeLeft.days}d
        </Box>
      )}
      <Box component="span" sx={{ typography: 'caption', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </Box>
    </Stack>
  );
}
