import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { SimpleLayout } from 'src/layouts/simple';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const SECTIONS = [
  {
    icon: 'solar:calendar-bold-duotone',
    title: '7-day return window',
    body: 'You can request a return within 7 days of confirming receipt, as long as the item is unused and in its original condition — the same standard every product listing states.',
  },
  {
    icon: 'solar:letter-bold-duotone',
    title: 'How to start a return',
    body: 'Contact the seller directly from your order page, or reach out to us if you need help. Since orders and reviews are tied to your on-chain purchase history, there\'s a clear, verifiable record of exactly what you bought and when.',
  },
  {
    icon: 'solar:card-transfer-bold-duotone',
    title: 'Refunds',
    body: 'Once a return is confirmed, the seller processes your refund. Because payment for a not-yet-completed order already sits in escrow rather than the seller\'s pocket, refunds before final settlement are straightforward — for orders already fully settled, the seller refunds you directly.',
  },
  {
    icon: 'solar:close-circle-bold-duotone',
    title: 'What can\'t be returned',
    body: 'Items that show signs of wear, are missing original packaging, or were custom/made-to-order aren\'t eligible for return. If you\'re unsure whether your item qualifies, ask before confirming receipt.',
  },
];

export function ReturnsView() {
  return (
    <SimpleLayout>
      <Container sx={{ py: { xs: 6, md: 10 }, maxWidth: 720, mx: 'auto' }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Returns
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6 }}>
          Our return policy, and how it connects to on-chain order history.
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
