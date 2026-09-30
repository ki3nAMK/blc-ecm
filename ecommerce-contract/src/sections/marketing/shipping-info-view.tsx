import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { SimpleLayout } from 'src/layouts/simple';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const SECTIONS = [
  {
    icon: 'solar:box-bold-duotone',
    title: 'Processing time',
    body: 'Orders ship within 1–2 business days of the seller marking your order as finalized. Since every seller runs their own shop, exact handling times can vary slightly — check the seller\'s response time on the product page if you need it by a specific date.',
  },
  {
    icon: 'solar:shield-check-bold-duotone',
    title: 'How payment release works',
    body: 'Your payment is held in an on-chain escrow contract, not with the seller or a payment processor. It only releases to the seller after you confirm receipt from your order page — so there\'s no incentive for a seller to ship slowly once they\'ve already been paid.',
  },
  {
    icon: 'solar:map-point-bold-duotone',
    title: 'Delivery estimates',
    body: 'Delivery time depends on the seller\'s location and carrier, typically 3–10 business days domestically. Tracking details, once available, are added to your order page by the seller.',
  },
  {
    icon: 'solar:danger-triangle-bold-duotone',
    title: "If something arrives damaged",
    body: 'Do not confirm receipt on a damaged or incorrect order. Instead, contact us right away — since your payment is still held in escrow at that point, we can help resolve it before any funds release to the seller.',
  },
];

export function ShippingInfoView() {
  return (
    <SimpleLayout>
      <Container sx={{ py: { xs: 6, md: 10 }, maxWidth: 720, mx: 'auto' }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Shipping Info
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6 }}>
          How orders move from checkout to your door — and how escrow protects you along the
          way.
        </Typography>

        <Stack spacing={5}>
          {SECTIONS.map((section) => (
            <Box key={section.title}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                <Iconify icon={section.icon} width={28} sx={{ color: 'primary.main' }} />
                <Typography variant="h6">{section.title}</Typography>
              </Stack>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {section.body}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Container>
    </SimpleLayout>
  );
}
