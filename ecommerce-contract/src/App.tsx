import 'src/global.css';

// ----------------------------------------------------------------------

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { useCaptureReferral } from 'src/hooks/use-capture-referral';

import { ThemeProvider } from 'src/theme/theme-provider';

import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context/jwt';

import { CartProvider } from './states/carts';
import { ProductProvider } from './states/products';
import { CompareProvider } from './states/compare';
import { NotifyProvider } from './states/socket/seller';
import { FavoritesProvider } from './states/favorites';
import { LocalizationProvider } from './utils/localization';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
  useCaptureReferral();
  const queryClient = new QueryClient();

  return (
    <LocalizationProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotifyProvider>
            <ProductProvider>
              <CartProvider>
                <FavoritesProvider>
                  <CompareProvider>
                    <SettingsProvider settings={defaultSettings}>
                      <ThemeProvider>
                        <MotionLazy>
                          <ProgressBar />
                          <SettingsDrawer />
                          <Router />
                        </MotionLazy>
                      </ThemeProvider>
                    </SettingsProvider>
                  </CompareProvider>
                </FavoritesProvider>
              </CartProvider>
            </ProductProvider>
          </NotifyProvider>
        </AuthProvider>
      </QueryClientProvider>
    </LocalizationProvider>
  );
}
