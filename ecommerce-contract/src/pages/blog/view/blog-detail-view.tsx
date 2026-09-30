import type { IBlogAuthor, IBlogPost } from 'src/types/blog-post';

import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import blogService from '@/lib/service/blog.service';
import { Label } from 'src/components/label';
import { Markdown } from 'src/components/markdown';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

type Props = {
  slug: string;
};

export function BlogDetailView({ slug }: Props) {
  const { data: post, isLoading, error } = useQuery<IBlogPost>({
    queryKey: ['blog-detail', slug],
    queryFn: () => blogService.getDetail(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <EmptyContent title="Loading post..." />
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <EmptyContent title="Post not found" />
      </Container>
    );
  }

  const author = post.authorId as IBlogAuthor | undefined;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Blog', href: paths.dashboard.blog.root },
          { name: post.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box
        component="img"
        src={post.coverUrl}
        alt={post.title}
        sx={{ width: 1, height: { xs: 240, md: 400 }, objectFit: 'cover', borderRadius: 2, mb: 4 }}
      />

      <Typography variant="h3" sx={{ mb: 2 }}>
        {post.title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, color: 'text.secondary' }}>
        <Avatar alt={author?.name} src={author?.avatar} sx={{ width: 32, height: 32 }} />
        <Typography variant="body2">{author?.name || 'Admin'}</Typography>
        <Box component="span">·</Box>
        <Typography variant="body2">{fDate(post.createdAt)}</Typography>
        <Box component="span">·</Box>
        <Typography variant="body2">{fShortenNumber(post.totalViews)} views</Typography>
      </Box>

      {post.tags?.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          {post.tags.map((tag) => (
            <Label key={tag} variant="soft">{tag}</Label>
          ))}
        </Box>
      )}

      <Markdown children={post.content} />
    </Container>
  );
}
