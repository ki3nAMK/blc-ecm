import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ContactView } from 'src/sections/marketing/contact-view';

// ----------------------------------------------------------------------

const metadata = { title: `Contact Us | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ContactView />
    </>
  );
}
