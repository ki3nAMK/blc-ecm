import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AffiliateDashboardView } from '../affiliate/view/affiliate-dashboard-view';

// ----------------------------------------------------------------------

const metadata = { title: `Affiliate Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AffiliateDashboardView />
    </>
  );
}
