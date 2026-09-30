import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { OverviewEcommerceView } from 'src/pages/e-commerce/view/overview-ecommerce-view';

// ----------------------------------------------------------------------

const metadata = { title: `E-commerce | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewEcommerceView />
    </>
  );
}
