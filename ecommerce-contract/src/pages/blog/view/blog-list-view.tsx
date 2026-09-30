import type { IBlogPost } from 'src/types/blog-post';

import { get } from 'lodash';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import blogService from '@/lib/service/blog.service';
import { Label } from 'src/components/label';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

const POSTS_PER_PAGE = 12;

export function BlogListView() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['blog-list', page],
    queryFn: () => blogService.getList(page, POSTS_PER_PAGE),
  });

  const posts = get(data, 'data', []) as IBlogPost[];
  const totalPages = get(data, 'pagination.totalPages', 1) as number;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <CustomBreadcrumbs
        heading="Blog"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Blog' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {isLoading ? (
        <EmptyContent title="Loading posts..." />
      ) : posts.length === 0 ? (
        <EmptyContent title="No posts yet" />
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            }}
          >
            {posts.map((post) => (
              <Card
                key={post.id}
                component={RouterLink}
                href={paths.dashboard.blog.details(post.slug)}
                sx={{
                  textDecoration: 'none',
                  transition: 'transform .3s, box-shadow .3s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
                }}
              >
                <CardMedia component="img" height={180} image={post.coverUrl} alt={post.title} />
                <CardContent>
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mb: 1 }}>
                    {post.tags?.slice(0, 2).map((tag) => (
                      <Label key={tag} variant="soft">{tag}</Label>
                    ))}
                  </Stack>
                  <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }} noWrap>
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                    }}
                  >
                    {post.excerpt}
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mt: 2, typography: 'caption', color: 'text.disabled' }}
                  >
                    <span>{fDate(post.createdAt)}</span>
                    <span>{fShortenNumber(post.totalViews)} views</span>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>

          {totalPages > 1 && (
            <Stack alignItems="center" sx={{ mt: 5 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                color="primary"
              />
            </Stack>
          )}
        </>
      )}
    </Container>
  );
}
