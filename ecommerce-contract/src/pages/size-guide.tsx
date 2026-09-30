import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SizeGuideView } from 'src/sections/marketing/size-guide-view';

// ----------------------------------------------------------------------

const metadata = { title: `Size Guide | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SizeGuideView />
    </>
  );
}
