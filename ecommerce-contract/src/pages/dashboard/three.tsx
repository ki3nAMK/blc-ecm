import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import EcommerceCartView from '../ProductCart';

// ----------------------------------------------------------------------

const metadata = { title: `Product card | Shoes - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EcommerceCartView />
    </>
  );
}
