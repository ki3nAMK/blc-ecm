import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';
import type { LinearProgressProps } from '@mui/material/LinearProgress';

import { fPercent, fCurrency } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  formatValue?: (value: number) => string;
  data: {
    label: string;
    value: number;
    totalAmount: number;
    color?: LinearProgressProps['color'];
  }[];
};

export function EcommerceSalesOverview({ title, subheader, data, formatValue = fCurrency, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ gap: 4, px: 3, py: 4, display: 'flex', flexDirection: 'column' }}>
        {data.map((progress) => (
          <Item key={progress.label} progress={progress} formatValue={formatValue} />
        ))}
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = {
  progress: Props['data'][number];
  formatValue: (value: number) => string;
};

function Item({ progress, formatValue }: ItemProps) {
  return (
    <div>
      <Box sx={{ mb: 1, gap: 0.5, display: 'flex', alignItems: 'center', typography: 'subtitle2' }}>
        <Box component="span" sx={{ flexGrow: 1 }}>
          {progress.label}
        </Box>
        <Box component="span">{formatValue(progress.totalAmount)}</Box>
        <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
          ({fPercent(progress.value)})
        </Box>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress.value}
        color={progress.color ?? 'primary'}
        sx={{
          height: 8,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.12),
        }}
      />
    </div>
  );
}
