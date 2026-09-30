import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BlogListView } from '../blog/view';

// ----------------------------------------------------------------------

const metadata = { title: `Blog | ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <BlogListView />
        </>
    );
}
