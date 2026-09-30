import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ShippingInfoView } from 'src/sections/marketing/shipping-info-view';

// ----------------------------------------------------------------------

const metadata = { title: `Shipping Info | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ShippingInfoView />
    </>
  );
}
