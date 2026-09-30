import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AdminBlogCreateView } from '../admin-blog/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new post | Admin - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <AdminBlogCreateView />
        </>
    );
}
