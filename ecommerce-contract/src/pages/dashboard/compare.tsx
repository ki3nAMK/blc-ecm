import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import CompareView from '../products/CompareView';

// ----------------------------------------------------------------------

const metadata = { title: `Compare Products | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <CompareView />
        </>
    );
}
