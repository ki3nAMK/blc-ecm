import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Error
const Page404 = lazy(() => import('src/pages/error/404'));

// Marketing / content pages (public — no auth required, unlike /dashboard/*)
const AboutPage = lazy(() => import('src/pages/about'));
const ContactPage = lazy(() => import('src/pages/contact'));
const ShippingInfoPage = lazy(() => import('src/pages/shipping-info'));
const ReturnsPage = lazy(() => import('src/pages/returns'));
const SizeGuidePage = lazy(() => import('src/pages/size-guide'));
const FaqsPage = lazy(() => import('src/pages/faqs'));

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      { path: '404', element: <Page404 /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'shipping-info', element: <ShippingInfoPage /> },
      { path: 'returns', element: <ReturnsPage /> },
      { path: 'size-guide', element: <SizeGuidePage /> },
      { path: 'faqs', element: <FaqsPage /> },
    ],
  },
];
