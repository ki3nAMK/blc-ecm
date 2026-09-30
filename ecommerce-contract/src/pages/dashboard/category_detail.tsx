import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { CategoryDetailView } from '../products/CategoryDetail';

// ----------------------------------------------------------------------

const metadata = { title: `Category | ${CONFIG.site.name}` };

export default function Page() {
    const { name = '' } = useParams();

    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <CategoryDetailView category={decodeURIComponent(name)} />
        </>
    );
}
