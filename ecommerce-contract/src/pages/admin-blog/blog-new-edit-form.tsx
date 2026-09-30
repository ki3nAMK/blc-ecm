import type { IBlogPost } from 'src/types/blog-post';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import blogService, { ICreateBlogPayload } from '@/lib/service/blog.service';

// ----------------------------------------------------------------------

export type NewBlogSchemaType = zod.infer<typeof NewBlogSchema>;

export const NewBlogSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  excerpt: zod.string(),
  content: schemaHelper.editor({ message: { required_error: 'Content is required!' } }),
  coverUrl: schemaHelper.file({ message: { required_error: 'Cover image is required!' } }),
  tags: zod.string().array(),
  publish: zod.boolean(),
});

// ----------------------------------------------------------------------

type Props = {
  currentPost?: IBlogPost;
};

export function BlogNewEditForm({ currentPost }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const defaultValues = useMemo(
    () => ({
      title: currentPost?.title || '',
      excerpt: currentPost?.excerpt || '',
      content: currentPost?.content || '',
      coverUrl: currentPost?.coverUrl || '',
      tags: currentPost?.tags || [],
      publish: currentPost?.publish === 'published',
    }),
    [currentPost]
  );

  const methods = useForm<NewBlogSchemaType>({
    resolver: zodResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { mutateAsync: createPost } = useMutation({
    mutationFn: (payload: ICreateBlogPayload) => blogService.create(payload),
  });

  const { mutateAsync: updatePost } = useMutation({
    mutationFn: (payload: ICreateBlogPayload) => blogService.update(currentPost!.id, payload),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const coverUrl =
        data.coverUrl instanceof File
          ? (await blogService.uploadImage(data.coverUrl)).url
          : (data.coverUrl as string);

      const payload: ICreateBlogPayload = {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        coverUrl,
        tags: data.tags,
        publish: data.publish ? 'published' : 'draft',
      };

      if (currentPost) {
        await updatePost(payload);
        toast.success('Post updated!');
      } else {
        await createPost(payload);
        toast.success('Post created!');
      }

      queryClient.invalidateQueries({ queryKey: ['admin-blog-list'] });
      router.push(paths.admin.blog.root);
    } catch (error) {
      console.error('blog submit error:', error);
      toast.error(currentPost ? 'Failed to update post' : 'Failed to create post');
    }
  });

  const handleRemoveCover = useCallback(() => {
    setValue('coverUrl', '');
  }, [setValue]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        <Card>
          <CardHeader title="Details" subheader="Title, excerpt, cover image..." sx={{ mb: 3 }} />

          <Divider />

          <Stack spacing={3} sx={{ p: 3 }}>
            <Field.Text name="title" label="Post title" />

            <Field.Text name="excerpt" label="Excerpt" multiline rows={2} />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Cover image</Typography>
              <Field.Upload name="coverUrl" maxSize={3145728} onDelete={handleRemoveCover} />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Content</Typography>
              <Field.Editor name="content" sx={{ maxHeight: 480 }} />
            </Stack>

            <Field.Autocomplete
              name="tags"
              label="Tags"
              placeholder="+ Tags"
              multiple
              freeSolo
              disableCloseOnSelect
              options={[]}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
            />
          </Stack>
        </Card>

        <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">
          <FormControlLabel
            control={
              <Switch
                checked={methods.watch('publish')}
                onChange={(e) => setValue('publish', e.target.checked)}
              />
            }
            label="Publish"
            sx={{ pl: 3, flexGrow: 1 }}
          />

          <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
            {!currentPost ? 'Create post' : 'Save changes'}
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
