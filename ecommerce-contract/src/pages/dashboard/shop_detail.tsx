import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { ShopDetailView } from '../shop/view';

// ----------------------------------------------------------------------

const metadata = { title: `Shop | ${CONFIG.site.name}` };

export default function Page() {
    const { id = '' } = useParams();

    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <ShopDetailView sellerId={id} />
        </>
    );
}
