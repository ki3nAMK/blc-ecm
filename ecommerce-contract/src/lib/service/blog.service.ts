import type { IBlogPost, IBlogListResponse } from "src/types/blog-post";

import { isNil } from "lodash";

import { http } from "../baseRequest";

export interface ICreateBlogPayload {
    title: string;
    excerpt?: string;
    content: string;
    coverUrl?: string;
    tags?: string[];
    publish?: 'draft' | 'published';
}

export type IUpdateBlogPayload = Partial<ICreateBlogPayload>;

const blogService = {
    // Public — published posts only
    getList: (page?: number, limit?: number): Promise<IBlogListResponse> =>
        http.axios.request({
            method: 'GET',
            url: `/blog?page=${isNil(page) ? 1 : page}&limit=${isNil(limit) ? 10 : limit}`,
        }),

    getDetail: (slug: string): Promise<IBlogPost> =>
        http.axios.request({
            method: 'GET',
            url: `/blog/${slug}`,
        }),

    // Admin — includes drafts
    adminGetList: (page?: number, limit?: number): Promise<IBlogListResponse> =>
        http.axios.request({
            method: 'GET',
            url: `/admin/blog?page=${isNil(page) ? 1 : page}&limit=${isNil(limit) ? 100 : limit}`,
        }),

    adminGetDetail: (id: string): Promise<IBlogPost> =>
        http.axios.request({
            method: 'GET',
            url: `/admin/blog/${id}`,
        }),

    create: (payload: ICreateBlogPayload): Promise<IBlogPost> =>
        http.axios.request({
            method: 'POST',
            url: `/admin/blog`,
            data: payload,
        }),

    update: (id: string, payload: IUpdateBlogPayload): Promise<IBlogPost> =>
        http.axios.request({
            method: 'PATCH',
            url: `/admin/blog/${id}`,
            data: payload,
        }),

    remove: (id: string): Promise<{ success: boolean }> =>
        http.axios.request({
            method: 'DELETE',
            url: `/admin/blog/${id}`,
        }),

    publish: (id: string): Promise<IBlogPost> =>
        http.axios.request({
            method: 'PATCH',
            url: `/admin/blog/${id}/publish`,
        }),

    uploadImage: (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('file', file);

        return http.axios.request({
            method: 'POST',
            url: `/admin/blog/upload-image`,
            data: formData,
            headers: { 'Content-Type': undefined },
        });
    },
};

export default blogService;
