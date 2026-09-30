import { useQuery } from '@tanstack/react-query';

// ----------------------------------------------------------------------

type CoinGeckoMarketChart = {
  prices: [number, number][]; // [timestamp_ms, price_usd][]
};

async function fetchEthPriceHistory() {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7'
  );
  if (!res.ok) throw new Error('Failed to fetch ETH price');

  const data = (await res.json()) as CoinGeckoMarketChart;
  const points = data.prices || [];

  // CoinGecko returns hourly granularity for a 7-day window (~168 points) — thin it down
  // to roughly one point per day so the x-axis stays readable.
  const step = Math.max(1, Math.ceil(points.length / 7));
  const sampled = points.filter((_, index) => index % step === 0 || index === points.length - 1);

  const dates = sampled.map(([timestamp]) =>
    new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );
  const values = sampled.map(([, price]) => Math.round(price * 100) / 100);

  const currentPrice = points.length ? points[points.length - 1][1] : null;
  const firstPrice = points.length ? points[0][1] : null;
  const changePercent =
    currentPrice != null && firstPrice
      ? ((currentPrice - firstPrice) / firstPrice) * 100
      : null;

  return { dates, values, currentPrice, changePercent };
}

export function useEthPrice() {
  return useQuery({
    queryKey: ['eth-price-history'],
    queryFn: fetchEthPriceHistory,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
