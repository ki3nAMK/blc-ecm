export interface IBlogAuthor {
  id?: string;
  _id?: string;
  name?: string;
  avatar?: string;
}

export interface IBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  tags: string[];
  publish: 'draft' | 'published';
  totalViews: number;
  authorId?: IBlogAuthor | string;
  createdAt: string;
  updatedAt: string;
}

export interface IBlogListResponse {
  data: IBlogPost[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
