import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import blogService from '@/lib/service/blog.service';

import { AdminBlogEditView } from '../admin-blog/view';

// ----------------------------------------------------------------------

const metadata = { title: `Edit post | Admin - ${CONFIG.site.name}` };

export default function Page() {
    const { id = '' } = useParams();

    const { data: post } = useQuery({
        queryKey: ['admin-blog-detail', id],
        queryFn: () => blogService.adminGetDetail(id),
        enabled: !!id,
    });

    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <AdminBlogEditView post={post} />
        </>
    );
}
