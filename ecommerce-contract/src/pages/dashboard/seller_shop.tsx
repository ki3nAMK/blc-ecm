import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SellerShopProfileView } from '../seller/shop-profile-view';

// ----------------------------------------------------------------------

const metadata = { title: `Shop Profile | ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <SellerShopProfileView />
        </>
    );
}
