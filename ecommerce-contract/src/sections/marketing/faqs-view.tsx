import { useState } from 'react';

import Accordion from '@mui/material/Accordion';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { SimpleLayout } from 'src/layouts/simple';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const FAQS = [
  {
    question: 'How does on-chain escrow actually work?',
    answer:
      'When you check out, your payment is sent to an escrow smart contract rather than directly to the seller. It stays locked there through the order\'s lifecycle and only releases to the seller once you confirm you\'ve received the item — protecting your funds until you\'re satisfied.',
  },
  {
    question: 'Do I need a crypto wallet to shop here?',
    answer:
      'Yes — you sign in and pay with a wallet like MetaMask instead of a username/password and a card. Every purchase is a real on-chain transaction, which is also what makes escrow, reviews, and the affiliate program verifiable.',
  },
  {
    question: 'How is the referral/affiliate program paid?',
    answer:
      'Switch your account to the Affiliate role to get a referral link. When someone checks out after following it, a commission is calculated automatically and settled in the same on-chain transaction as the sale — no waiting period, no manual payout request.',
  },
  {
    question: 'Can I trust product reviews?',
    answer:
      "Reviews are tied to verified on-chain purchases, so a review only appears from an account that actually bought and received the item — not something a seller can add or remove after the fact.",
  },
  {
    question: 'What happens if a seller never ships my order?',
    answer:
      "Your payment stays in escrow until you confirm receipt. If an order stalls, contact us — since the funds haven't released to the seller yet, we can help resolve it.",
  },
  {
    question: 'How do flash sales and discounts work?',
    answer:
      'When a seller runs a flash sale, the discounted price is enforced by the escrow contract itself for the duration of the sale — you pay exactly the discounted amount shown, not a price that gets adjusted after checkout.',
  },
  {
    question: 'Can I become a seller?',
    answer:
      'Seller accounts are enabled the same way admin accounts are in this environment — reach out via the Contact page and we\'ll get you set up with a seller wallet.',
  },
  {
    question: 'What are your return and shipping policies?',
    answer:
      'See the Returns and Shipping Info pages linked in the footer — in short, a 7-day return window on unused items, and shipping within 1–2 business days of an order being finalized.',
  },
];

export function FaqsView() {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <SimpleLayout>
      <Container sx={{ py: { xs: 6, md: 10 }, maxWidth: 760, mx: 'auto' }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6 }}>
          Everything about how buying, selling, and escrow work here.
        </Typography>

        {FAQS.map((faq, index) => {
          const panel = `panel${index}`;
          return (
            <Accordion
              key={panel}
              expanded={expanded === panel}
              onChange={handleChange(panel)}
              disableGutters
              sx={{ '&:before': { display: 'none' } }}
            >
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                <Typography variant="subtitle1">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Container>
    </SimpleLayout>
  );
}
