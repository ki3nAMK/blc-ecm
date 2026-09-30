import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { BlogDetailView } from '../blog/view';

// ----------------------------------------------------------------------

const metadata = { title: `Blog post | ${CONFIG.site.name}` };

export default function Page() {
    const { slug = '' } = useParams();

    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <BlogDetailView slug={slug} />
        </>
    );
}
