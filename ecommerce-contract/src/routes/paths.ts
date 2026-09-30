// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  SELLER: '/seller',
  USER: '/user',
  AFFILIATE: '/affiliate',
  ADMIN: '/admin',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  about: '/about',
  contact: '/contact',
  shippingInfo: '/shipping-info',
  returns: '/returns',
  sizeGuide: '/size-guide',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
      cart: `${ROOTS.DASHBOARD}/product/cart`,
      favorites: `${ROOTS.DASHBOARD}/product/favorites`,
      compare: `${ROOTS.DASHBOARD}/product/compare`,
    },
    seller: {
      general: `${ROOTS.SELLER}`,
      shop: `${ROOTS.SELLER}/shop`,
      product: {
        root: `${ROOTS.SELLER}/product`,
        new: `${ROOTS.SELLER}/product/new`,
        edit: `${ROOTS.SELLER}/product/edit/_ID`,
      },
      order: {
        root: `${ROOTS.SELLER}/order`,
        detail: `${ROOTS.SELLER}/order/detail/_ID`,
      }
    },
    user: {
      general: `${ROOTS.USER}`,
      order: {
        root: `${ROOTS.USER}/order`,
        detail: `${ROOTS.USER}/order/detail/_ID`,
      }
    },
    affiliate: {
      general: `${ROOTS.AFFILIATE}`,
    },
    blog: {
      root: `${ROOTS.DASHBOARD}/blog`,
      details: (slug: string) => `${ROOTS.DASHBOARD}/blog/${slug}`,
    },
    shop: {
      root: `${ROOTS.DASHBOARD}/shop`,
      details: (id: string) => `${ROOTS.DASHBOARD}/shop/${id}`,
    },
    category: {
      details: (name: string) => `${ROOTS.DASHBOARD}/category/${encodeURIComponent(name)}`,
    },
    messages: {
      root: `${ROOTS.DASHBOARD}/messages`,
      details: (id: string) => `${ROOTS.DASHBOARD}/messages/${id}`,
    },
  },
  admin: {
    general: `${ROOTS.ADMIN}`,
    blog: {
      root: `${ROOTS.ADMIN}/blog`,
      new: `${ROOTS.ADMIN}/blog/new`,
      edit: `${ROOTS.ADMIN}/blog/edit/_ID`,
    },
  },
};
