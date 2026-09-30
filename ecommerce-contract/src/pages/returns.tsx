import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ReturnsView } from 'src/sections/marketing/returns-view';

// ----------------------------------------------------------------------

const metadata = { title: `Returns | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ReturnsView />
    </>
  );
}
