import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductListView } from '../product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ecommerce | product list - ${CONFIG.site.name}` };

export default function ProductListPage() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <ProductListView />
        </>
    );
}
