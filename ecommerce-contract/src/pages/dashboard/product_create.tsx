import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductCreateView } from '../product/view';


// ----------------------------------------------------------------------

const metadata = { title: `Create a new product | Dashboard - ${CONFIG.site.name}` };

export default function ProductCreatePage() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <ProductCreateView />
        </>
    );
}
