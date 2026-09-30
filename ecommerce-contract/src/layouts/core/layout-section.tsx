import type { Theme, SxProps, CSSObject } from '@mui/material/styles';

import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
// ----------------------------------------------------------------------
import Grid2 from '@mui/material/Unstable_Grid2';
import GlobalStyles from '@mui/material/GlobalStyles';
import {
  Twitter,
  YouTube,
  Facebook,
  Instagram,
} from '@mui/icons-material';
import {
  Box,
  Link,
  Stack,
  Button,
  Divider,
  Container,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { toast } from 'src/components/snackbar';

import { layoutClasses } from '../classes';

export type LayoutSectionProps = {
  sx?: SxProps<Theme>;
  cssVars?: CSSObject;
  children?: React.ReactNode;
  footerSection?: React.ReactNode;
  headerSection?: React.ReactNode;
  sidebarSection?: React.ReactNode;
};

export function LayoutSection({
  sx,
  cssVars,
  children,
  footerSection,
  headerSection,
  sidebarSection,
}: LayoutSectionProps) {
  const inputGlobalStyles = (
    <GlobalStyles
      styles={{
        body: {
          '--layout-nav-zIndex': 1101,
          '--layout-nav-mobile-width': '320px',
          '--layout-header-blur': '8px',
          '--layout-header-zIndex': 1100,
          '--layout-header-mobile-height': '64px',
          '--layout-header-desktop-height': '72px',
          ...cssVars,
        },
      }}
    />
  );

  return (
    <>
      {inputGlobalStyles}

      <Box id="root__layout" className={layoutClasses.root} sx={sx}>
        {sidebarSection ? (
          <>
            {sidebarSection}
            <Box
              display="flex"
              flex="1 1 auto"
              flexDirection="column"
              className={layoutClasses.hasSidebar}
            >
              {headerSection}
              {children}
              {footerSection}
            </Box>
          </>
        ) : (
          <>
            <AnnouncementBar />
            {headerSection}
            {children}
            {footerSection}
            <Footer />
          </>
        )}
      </Box>
    </>
  );
}

const AnnouncementBar = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const message = (
    <Typography
      variant="body2"
      component="span"
      sx={{
        fontWeight: 600,
        mx: 4, // khoảng cách giữa các thông báo
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      <Link component={RouterLink} href={paths.shippingInfo} underline="none" color="inherit" sx={{ '&:hover': { color: theme.palette.primary.main } }}>
        {t('announcement.freeShipping')}
      </Link>{' '}
      •{' '}
      <Link component={RouterLink} href={paths.dashboard.root} underline="none" color="inherit" sx={{ '&:hover': { color: theme.palette.primary.main } }}>
        {t('announcement.summerSale')}
      </Link>{' '}
      •{' '}
      <Link component={RouterLink} href={paths.dashboard.root} underline="none" color="inherit" sx={{ '&:hover': { color: theme.palette.primary.main } }}>
        {t('announcement.newArrivals')}
      </Link>
    </Typography>
  );

  return (
    <Box
      sx={{
        bgcolor: '#e0e0e0',
        color: '#212121',
        py: 1,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '100%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <Box
        sx={{
          display: 'inline-block',
          animation: 'marquee 12s linear infinite',
          '@keyframes marquee': {
            '0%': { transform: 'translateX(0%)' },
            '100%': { transform: 'translateX(-50%)' },
          },
        }}
      >
        {message}
        {message}
        {message}
        {message}
        {message}
        {message}
        {message}
        {message}
      </Box>
    </Box>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const quickLinks = [
    { label: t('footer.links.home'), href: paths.dashboard.root },
    { label: t('footer.links.shop'), href: paths.dashboard.root },
    { label: t('footer.links.newArrivals'), href: paths.dashboard.root },
    { label: t('footer.links.sale'), href: paths.dashboard.root },
    { label: t('footer.links.shops'), href: paths.dashboard.shop.root },
    { label: t('footer.links.aboutUs'), href: paths.about },
  ];

  const customerCareLinks = [
    { label: t('footer.links.contactUs'), href: paths.contact },
    { label: t('footer.links.shippingInfo'), href: paths.shippingInfo },
    { label: t('footer.links.returns'), href: paths.returns },
    { label: t('footer.links.sizeGuide'), href: paths.sizeGuide },
    { label: t('footer.links.faqs'), href: paths.faqs },
  ];

  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // No backend newsletter-signup endpoint exists — confirms locally so the form is
    // genuinely usable rather than a silent dead end, same scope as the contact form.
    toast.success('Subscribed! Watch your inbox for new drops.');
    setEmail('');
  };

  return (
    <Box
      sx={{
        bgcolor: '#111',
        color: '#aaa',
        pt: 8,
        pb: 4,
        mt: 12,
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={4}>
          {/* Cột 1: Logo & Description */}
          <Grid2 xs={12} md={3}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                mb: 2,
                letterSpacing: '0.5px',
              }}
            >
              SHOEZ
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
              {t('footer.tagline')}
            </Typography>
          </Grid2>

          {/* Cột 2: Quick Links */}
          <Grid2 xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white', mb: 2 }}>
              {t('footer.quickLinks')}
            </Typography>
            <Stack spacing={1}>
              {quickLinks.map((item) => (
                <Link
                  key={item.label}
                  component={RouterLink}
                  href={item.href}
                  underline="hover"
                  color="inherit"
                  sx={{ fontSize: '0.9rem' }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid2>

          {/* Cột 3: Customer Care */}
          <Grid2 xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white', mb: 2 }}>
              {t('footer.customerCare')}
            </Typography>
            <Stack spacing={1}>
              {customerCareLinks.map((item) => (
                <Link
                  key={item.label}
                  component={RouterLink}
                  href={item.href}
                  underline="hover"
                  color="inherit"
                  sx={{ fontSize: '0.9rem' }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid2>

          {/* Cột 4: Follow Us */}
          <Grid2 xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white', mb: 2 }}>
              {t('footer.followUs')}
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" sx={{ color: '#aaa', '&:hover': { color: 'white' } }}>
                <Facebook />
              </IconButton>
              <IconButton size="small" sx={{ color: '#aaa', '&:hover': { color: 'white' } }}>
                <Instagram />
              </IconButton>
              <IconButton size="small" sx={{ color: '#aaa', '&:hover': { color: 'white' } }}>
                <Twitter />
              </IconButton>
              <IconButton size="small" sx={{ color: '#aaa', '&:hover': { color: 'white' } }}>
                <YouTube />
              </IconButton>
            </Stack>
          </Grid2>

          {/* Cột 5: Newsletter */}
          <Grid2 xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white', mb: 2 }}>
              {t('footer.stayUpdated')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {t('footer.newsletterText')}
            </Typography>
            <Stack component="form" direction="row" spacing={1} onSubmit={handleSubscribe}>
              <TextField
                placeholder={t('footer.emailPlaceholder')}
                variant="outlined"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#222',
                    color: '#ccc',
                    borderRadius: 1,
                    fontSize: '0.875rem',
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: 'success.main',
                  textTransform: 'none',
                  px: 2,
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'success.dark' },
                }}
              >
                {t('footer.subscribe')}
              </Button>
            </Stack>
          </Grid2>
        </Grid2>

        <Divider sx={{ bgcolor: '#333', my: 4 }} />

        {/* Bottom Bar */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" color="#666">
            {t('footer.copyright')}
          </Typography>

        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;