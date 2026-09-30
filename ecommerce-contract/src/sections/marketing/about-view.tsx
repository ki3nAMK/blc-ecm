import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { SimpleLayout } from 'src/layouts/simple';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const VALUES = [
  {
    icon: 'solar:shield-check-bold-duotone',
    title: 'Escrow you can verify',
    description:
      'Every order settles through an on-chain escrow contract. Your payment is only released to the seller after you confirm receipt — not before.',
  },
  {
    icon: 'solar:users-group-rounded-bold-duotone',
    title: 'Independent sellers',
    description:
      'Every listing comes from a real seller running their own shop, keeping more of what they earn since there is no payment processor taking a cut.',
  },
  {
    icon: 'solar:link-round-angle-bold-duotone',
    title: 'A referral program that pays instantly',
    description:
      'Affiliates earn a commission the moment a referred order settles — paid automatically on-chain, no waiting period, nothing to reconcile.',
  },
];

export function AboutView() {
  return (
    <SimpleLayout>
      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h2" sx={{ mb: 2, textAlign: 'center' }}>
          About SHOEZ
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 720, mx: 'auto', mb: 8 }}
        >
          SHOEZ is a decentralized marketplace for sneakers, streetwear, and accessories —
          built so that every purchase, review, and payout happens on-chain instead of behind a
          company's private database.
        </Typography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {VALUES.map((value) => (
            <Grid item xs={12} md={4} key={value.title}>
              <Box sx={{ textAlign: 'center', px: 2 }}>
                <Iconify icon={value.icon} width={48} sx={{ color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {value.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {value.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Why we built it this way
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            Most marketplaces put a payment processor and a private database between a buyer
            and a seller — you're trusting the platform's word that your money is safe and that
            reviews are genuine. We wanted something more verifiable: escrow enforced by a
            smart contract, product provenance you can trace, and a review system tied to real,
            on-chain purchases that nobody can quietly edit after the fact.
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            That doesn't change what it feels like to browse and buy — it's still just shopping.
            It changes what happens underneath, in ways we think make the whole system more
            honest for buyers and sellers alike.
          </Typography>
        </Box>
      </Container>
    </SimpleLayout>
  );
}
