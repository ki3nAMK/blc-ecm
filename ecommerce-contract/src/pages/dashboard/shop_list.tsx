import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ShopListView } from '../shop/view';

// ----------------------------------------------------------------------

const metadata = { title: `Shops | ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <ShopListView />
        </>
    );
}
