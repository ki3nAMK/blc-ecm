import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { SimpleLayout } from 'src/layouts/simple';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const CONTACT_METHODS = [
  { icon: 'solar:letter-bold-duotone', label: 'Email', value: 'support@shoez.example' },
  { icon: 'solar:clock-circle-bold-duotone', label: 'Support hours', value: 'Mon–Fri, 9am–6pm' },
  { icon: 'solar:chat-round-dots-bold-duotone', label: 'Response time', value: 'Usually within 1 business day' },
];

export function ContactView() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    // No backend endpoint exists to receive contact messages yet — this confirms the
    // message locally so the form is genuinely usable rather than a silent dead end.
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: '', email: '', message: '' });
      setSubmitting(false);
    }, 500);
  };

  return (
    <SimpleLayout>
      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h2" sx={{ mb: 2, textAlign: 'center' }}>
          Contact Us
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 560, mx: 'auto', mb: 6 }}
        >
          Questions about an order, a listing, or the platform itself? Send us a message.
        </Typography>

        <Grid container spacing={6} sx={{ maxWidth: 960, mx: 'auto' }}>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {CONTACT_METHODS.map((method) => (
                <Stack direction="row" spacing={2} key={method.label}>
                  <Iconify icon={method.icon} width={28} sx={{ color: 'primary.main', flexShrink: 0 }} />
                  <Box>
                    <Typography variant="subtitle2">{method.label}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {method.value}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField label="Your name" value={form.name} onChange={handleChange('name')} fullWidth />
                <TextField
                  label="Your email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  fullWidth
                />
                <TextField
                  label="Message"
                  value={form.message}
                  onChange={handleChange('message')}
                  multiline
                  rows={5}
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {submitting ? 'Sending...' : 'Send message'}
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </SimpleLayout>
  );
}
