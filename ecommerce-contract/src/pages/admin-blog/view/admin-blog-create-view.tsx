import { paths } from 'src/routes/paths';

import { useAuthContext } from '@/auth/hooks';
import { DashboardContent } from 'src/layouts/dashboard';

import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BlogNewEditForm } from '../blog-new-edit-form';

// ----------------------------------------------------------------------

export function AdminBlogCreateView() {
  const { user } = useAuthContext();

  return (
    <RoleBasedGuard currentRole={user?.role || ''} acceptRoles={['ADMIN']} hasContent>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="Create a new post"
          links={[
            { name: 'Admin' },
            { name: 'Blog', href: paths.admin.blog.root },
            { name: 'New post' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <BlogNewEditForm />
      </DashboardContent>
    </RoleBasedGuard>
  );
}
