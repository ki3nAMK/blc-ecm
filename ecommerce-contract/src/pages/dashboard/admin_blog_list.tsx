import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AdminBlogListView } from '../admin-blog/view';

// ----------------------------------------------------------------------

const metadata = { title: `Blog management | Admin - ${CONFIG.site.name}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <AdminBlogListView />
        </>
    );
}
