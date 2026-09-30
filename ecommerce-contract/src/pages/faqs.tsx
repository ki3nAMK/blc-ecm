import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { FaqsView } from 'src/sections/marketing/faqs-view';

// ----------------------------------------------------------------------

const metadata = { title: `FAQs | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FaqsView />
    </>
  );
}
