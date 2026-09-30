import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import FavoritesView from '../products/FavoritesView';

// ----------------------------------------------------------------------

const metadata = { title: `Favorites | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <FavoritesView />
        </>
    );
}
