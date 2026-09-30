import type { IBlogPost } from 'src/types/blog-post';

import { paths } from 'src/routes/paths';

import { useAuthContext } from '@/auth/hooks';
import { DashboardContent } from 'src/layouts/dashboard';

import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BlogNewEditForm } from '../blog-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  post?: IBlogPost;
};

export function AdminBlogEditView({ post }: Props) {
  const { user } = useAuthContext();

  return (
    <RoleBasedGuard currentRole={user?.role || ''} acceptRoles={['ADMIN']} hasContent>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="Edit post"
          links={[
            { name: 'Admin' },
            { name: 'Blog', href: paths.admin.blog.root },
            { name: post?.title },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        {post && <BlogNewEditForm currentPost={post} />}
      </DashboardContent>
    </RoleBasedGuard>
  );
}
