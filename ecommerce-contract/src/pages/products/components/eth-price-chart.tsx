import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { useEthPrice } from 'src/hooks/use-eth-price';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export function EthPriceChart() {
  const theme = useTheme();
  const { data, isLoading, isError } = useEthPrice();

  // A broken external price feed shouldn't break the home page — omit the section
  // silently rather than showing a half-rendered chart.
  if (isError) return null;

  const chartOptions = useChart({
    colors: [theme.palette.primary.main],
    xaxis: { categories: data?.dates || [] },
    yaxis: { labels: { formatter: (value: number) => `$${value.toLocaleString()}` } },
    tooltip: { y: { formatter: (value: number) => `$${value.toLocaleString()}` } },
  });

  return (
    <Card>
      <CardHeader
        title="ETH / USD"
        subheader="Last 7 days · live from CoinGecko"
        action={
          data?.currentPrice != null && (
            <Stack alignItems="flex-end" spacing={0.5}>
              <Typography variant="h6">
                ${data.currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </Typography>
              {data.changePercent != null && (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                  sx={{ color: data.changePercent >= 0 ? 'success.main' : 'error.main' }}
                >
                  <Iconify
                    width={16}
                    icon={data.changePercent >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'}
                  />
                  <Typography variant="caption" fontWeight={600}>
                    {data.changePercent >= 0 ? '+' : ''}
                    {data.changePercent.toFixed(2)}%
                  </Typography>
                </Stack>
              )}
            </Stack>
          )
        }
        sx={{ mb: 1 }}
      />

      {isLoading ? (
        <Box sx={{ px: 3, pb: 3 }}>
          <Skeleton variant="rounded" height={320} />
        </Box>
      ) : (
        <Chart
          type="area"
          series={[{ name: 'ETH/USD', data: data?.values || [] }]}
          options={chartOptions}
          height={320}
          sx={{ py: 2.5, pl: 1, pr: 2.5 }}
        />
      )}
    </Card>
  );
}
