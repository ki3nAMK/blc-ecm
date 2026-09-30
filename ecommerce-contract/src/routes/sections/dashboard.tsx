import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const PageTwo = lazy(() => import('src/pages/dashboard/two'));
const PageThree = lazy(() => import('src/pages/dashboard/three'));
const PageFour = lazy(() => import('src/pages/dashboard/four'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product_list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product_create'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product_edit'));
const OrderListPage = lazy(() => import('src/pages/dashboard/order_list'));
const OrderDetailPage = lazy(() => import('src/pages/dashboard/order_detail'));
const AffiliateDashboardPage = lazy(() => import('src/pages/dashboard/affiliate'));
const SellerShopPage = lazy(() => import('src/pages/dashboard/seller_shop'));
const BlogListPage = lazy(() => import('src/pages/dashboard/blog_list'));
const BlogDetailPage = lazy(() => import('src/pages/dashboard/blog_detail'));
const ShopListPage = lazy(() => import('src/pages/dashboard/shop_list'));
const ShopDetailPage = lazy(() => import('src/pages/dashboard/shop_detail'));
const CategoryDetailPage = lazy(() => import('src/pages/dashboard/category_detail'));
const MessagesPage = lazy(() => import('src/pages/dashboard/messages'));
const AdminBlogListPage = lazy(() => import('src/pages/dashboard/admin_blog_list'));
const AdminBlogCreatePage = lazy(() => import('src/pages/dashboard/admin_blog_create'));
const AdminBlogEditPage = lazy(() => import('src/pages/dashboard/admin_blog_edit'));
const FavoritesPage = lazy(() => import('src/pages/dashboard/favorites'));
const ComparePage = lazy(() => import('src/pages/dashboard/compare'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout isContainNavbar={false}>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

const layoutSellerContent = (
  <DashboardLayout isContainNavbar type='seller'>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

const layoutClientContent = (
  <DashboardLayout isContainNavbar type='client'>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

const layoutAffiliateContent = (
  <DashboardLayout isContainNavbar type='affiliate'>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

const layoutAdminContent = (
  <DashboardLayout isContainNavbar type='admin'>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'product',
        children: [
          { path: 'cart', element: <PageThree /> },
          { path: 'favorites', element: <FavoritesPage /> },
          { path: 'compare', element: <ComparePage /> },
          { path: ':id', element: <PageTwo /> },
        ],
      },
      {
        path: 'blog',
        children: [
          { index: true, element: <BlogListPage /> },
          { path: ':slug', element: <BlogDetailPage /> },
        ],
      },
      {
        path: 'shop',
        children: [
          { index: true, element: <ShopListPage /> },
          { path: ':id', element: <ShopDetailPage /> },
        ],
      },
      { path: 'category/:name', element: <CategoryDetailPage /> },
      {
        path: 'messages',
        children: [
          { index: true, element: <MessagesPage /> },
          { path: ':id', element: <MessagesPage /> },
        ],
      },
    ],
  },
  {
    path: 'seller',
    element: CONFIG.auth.skip ? <>{layoutSellerContent}</> : <AuthGuard>{layoutSellerContent}</AuthGuard>,
    children: [
      { element: <PageFour />, index: true },
      { path: 'shop', element: <SellerShopPage /> },
      {
        path: 'product',
        children: [
          { index: true, element: <ProductListPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: 'edit/:id', element: <ProductEditPage /> }
        ],
      },
      {
        path: 'order',
        children: [
          { index: true, element: <OrderListPage /> },
          { path: 'detail/:id', element: <OrderDetailPage /> }
        ]
      }
    ],
  },
  {
    path: 'user',
    element: CONFIG.auth.skip ? <>{layoutClientContent}</> : <AuthGuard>{layoutClientContent}</AuthGuard>,
    children: [
      { element: <PageFour />, index: true },
      {
        path: 'order',
        children: [
          { index: true, element: <OrderListPage /> },
          { path: 'detail/:id', element: <OrderDetailPage /> }
        ]
      }
    ]
  },
  {
    path: 'affiliate',
    element: CONFIG.auth.skip ? <>{layoutAffiliateContent}</> : <AuthGuard>{layoutAffiliateContent}</AuthGuard>,
    children: [
      { element: <AffiliateDashboardPage />, index: true },
    ],
  },
  {
    path: 'admin',
    element: CONFIG.auth.skip ? <>{layoutAdminContent}</> : <AuthGuard>{layoutAdminContent}</AuthGuard>,
    children: [
      {
        path: 'blog',
        children: [
          { index: true, element: <AdminBlogListPage /> },
          { path: 'new', element: <AdminBlogCreatePage /> },
          { path: 'edit/:id', element: <AdminBlogEditPage /> },
        ],
      },
    ],
  }
];
