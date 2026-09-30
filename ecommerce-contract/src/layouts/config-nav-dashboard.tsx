import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Overview 6.0.0',
    items: [
      { title: 'One', path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: 'Two', path: paths.dashboard.two, icon: ICONS.ecommerce },
      { title: 'Three', path: paths.dashboard.three, icon: ICONS.analytics },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'Group',
        path: paths.dashboard.group.root,
        icon: ICONS.user,
        children: [
          { title: 'Four', path: paths.dashboard.group.root },
          { title: 'Five', path: paths.dashboard.group.five },
          { title: 'Six', path: paths.dashboard.group.six },
        ],
      },
    ],
  },
];


export const sellerNavData = [
  {
    subheader: 'Overview',
    items: [
      { title: 'Ecommerce', path: paths.dashboard.seller.general, icon: ICONS.ecommerce },
    ],
  },
  {
    subheader: 'Management',
    items: [
      {
        title: 'Product',
        path: paths.dashboard.product.root,
        icon: ICONS.product,
        children: [
          { title: 'List', path: paths.dashboard.seller.product.root },
          { title: 'Create', path: paths.dashboard.seller.product.new },
          // { title: 'Edit', path: paths.dashboard.seller.product.edit },
        ],
      },
      {
        title: 'Order',
        path: paths.dashboard.seller.order.root,
        icon: ICONS.order,
      },
      {
        title: 'Shop Profile',
        path: paths.dashboard.seller.shop,
        icon: ICONS.job,
      },
    ]
  }
];

export const affiliateNavData = [
  {
    subheader: 'Overview',
    items: [
      { title: 'Shop', path: paths.dashboard.root, icon: ICONS.ecommerce },
      { title: 'Affiliate Dashboard', path: paths.dashboard.affiliate.general, icon: ICONS.analytics },
    ],
  },
];

export const adminNavData = [
  {
    subheader: 'Overview',
    items: [
      { title: 'Shop', path: paths.dashboard.root, icon: ICONS.ecommerce },
    ],
  },
  {
    subheader: 'Management',
    items: [
      {
        title: 'Blog',
        path: paths.admin.blog.root,
        icon: ICONS.blog,
        children: [
          { title: 'List', path: paths.admin.blog.root },
          { title: 'Create', path: paths.admin.blog.new },
        ],
      },
    ],
  },
];

export const clientNavData = [
  {
    subheader: 'Overview',
    items: [
      { title: 'Ecommerce', path: paths.dashboard.user.general, icon: ICONS.ecommerce },
    ],
  },
  {
    subheader: 'Management',
    items: [
      {
        title: 'Order',
        path: paths.dashboard.user.order.root,
        icon: ICONS.order,
      },
    ]
  }
];
