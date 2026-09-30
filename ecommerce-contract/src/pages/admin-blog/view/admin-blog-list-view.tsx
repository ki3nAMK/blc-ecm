import type { IBlogPost } from 'src/types/blog-post';
import type { GridColDef } from '@mui/x-data-grid';

import { get } from 'lodash';
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import {
  DataGrid,
  gridClasses,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useAuthContext } from '@/auth/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import blogService from '@/lib/service/blog.service';
import { toast } from 'src/components/snackbar';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export function AdminBlogListView() {
  const { user } = useAuthContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  const confirmDelete = useBoolean();
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blog-list'],
    queryFn: () => blogService.adminGetList(1, 100),
  });

  const posts = get(data, 'data', []) as IBlogPost[];

  const { mutateAsync: deletePost } = useMutation({
    mutationFn: (id: string) => blogService.remove(id),
    onSuccess: () => {
      toast.success('Post deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-blog-list'] });
    },
    onError: () => toast.error('Failed to delete post'),
  });

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.admin.blog.edit.replace('_ID', id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (post: IBlogPost) => {
      router.push(paths.dashboard.blog.details(post.slug));
    },
    [router]
  );

  const handleDeleteRow = (id: string) => {
    setRowToDelete(id);
    confirmDelete.onTrue();
  };

  const columns: GridColDef<IBlogPost>[] = [
    {
      field: 'title',
      headerName: 'Post',
      flex: 1,
      minWidth: 320,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1.5, width: 1 }}>
          <Avatar alt={params.row.title} src={params.row.coverUrl} variant="rounded" sx={{ width: 56, height: 56 }} />
          <ListItemText
            primary={params.row.title}
            secondary={params.row.excerpt}
            primaryTypographyProps={{ noWrap: true }}
            secondaryTypographyProps={{ noWrap: true, sx: { color: 'text.disabled' } }}
          />
        </Stack>
      ),
    },
    {
      field: 'tags',
      headerName: 'Tags',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          {(params.row.tags || []).slice(0, 3).map((tag) => (
            <Label key={tag} variant="soft">{tag}</Label>
          ))}
        </Stack>
      ),
    },
    {
      field: 'totalViews',
      headerName: 'Views',
      width: 100,
      valueFormatter: (value) => fShortenNumber(value),
    },
    {
      field: 'publish',
      headerName: 'Publish',
      width: 120,
      renderCell: (params) => (
        <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
          {params.row.publish}
        </Label>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 140,
      valueFormatter: (value) => fDate(value),
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="View"
          onClick={() => handleViewRow(params.row)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => handleDeleteRow(params.row.id)}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  return (
    <RoleBasedGuard currentRole={user?.role || ''} acceptRoles={['ADMIN']} hasContent>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="Blog"
          links={[{ name: 'Admin' }, { name: 'Blog' }]}
          action={
            <Button
              component={RouterLink}
              href={paths.admin.blog.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New post
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: 2 },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            disableRowSelectionOnClick
            rows={posts}
            columns={columns}
            loading={isLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            slots={{
              toolbar: CustomToolbar,
              noRowsOverlay: () => <EmptyContent title="No posts yet" />,
            }}
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Delete post"
        content="Are you sure you want to delete this post?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              if (rowToDelete) await deletePost(rowToDelete);
              confirmDelete.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </RoleBasedGuard>
  );
}

// ----------------------------------------------------------------------

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter sx={{ ml: 'auto' }} />
    </GridToolbarContainer>
  );
}
