import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store"; // Adjust the import path as necessary
import type { BlogResponse, CreateBlogPostPayload, GetBlogsResponse, SingleBlogObject } from '@/types/blog';

export const blogApi = createApi({
  reducerPath: "blogApi", // Unique key for this API slice
  baseQuery: fetchBaseQuery({
    baseUrl: "https://healthsync.weytech.et/api/api",
    credentials: "include",

    }),
  tagTypes: ["BlogPost"], 
  
  // For cache invalidation
  endpoints: (builder) => ({
    // Fetch all blogs (with optional filters and pagination)
    getBlogs: builder.query<GetBlogsResponse, { author_id?: string; tag?: string; page?: number; limit?: number; sort?: string; }>({
      query: (params) => ({
        url: "/blogs",
        method: "GET",
        params,
      }),
      providesTags: (result, error, arg) =>
        result
          ? [
            ...result.data.blogs.map(({ _id }) => ({ type: "BlogPost" as const, id: _id })),
            { type: "BlogPost", id: "LIST" },
          ]
          : [{ type: "BlogPost", id: "LIST" }],
    }),

    // Fetch bookmarked blogs for current user
    getBookmarkedBlogs: builder.query<BlogResponse, void>({
      query: () => ({
        url: "/blogs/bookmarks/me",
        method: "GET",
      }),
      providesTags: ['BlogPost'],
    }),

    // Bookmark a blog
    bookmarkBlog: builder.mutation<void, { blogId: string }>({
      query: ({ blogId }) => ({
        url: `/blogs/${blogId}/bookmarks/me`,
        method: 'PATCH',
      }),
      invalidatesTags: ['BlogPost'],
    }),
    // Remove bookmark from a blog
    removeBookmark: builder.mutation<void, { blogId: string }>({
      query: ({ blogId }) => ({
        url: `/blogs/${blogId}/bookmarks/me`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BlogPost'],
    }),
    // Create a blog post
    createBlogPost: builder.mutation<SingleBlogObject, CreateBlogPostPayload>({
      query: (newPost) => {
        return {
          url: "/blogs",
          method: "POST",
          body: {
            author: newPost.author,
            title: newPost.title,
            content: newPost.content,
            tags: newPost.tags || [], // Default empty array if not provided
            thumbnail: newPost.thumbnail, // Optional
            published: newPost.published ?? true, // Default to true
            publishedAt: newPost.publishedAt || new Date().toISOString()
          },
        }
      },
      invalidatesTags: [{ type: "BlogPost", id: "LIST" }],
    }),

    // Delete a blog post
    deleteBlogPost: builder.mutation<void, string>({
      query: (blogId) => ({
        url: `/blogs/${blogId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "BlogPost", id }, { type: "BlogPost", id: "LIST" }],
    }),


    // delete a blog post by author
    deleteBlogPostByAuthor: builder.mutation<void, string>({
      query: (blogId) => ({
        url: `/blogs/me/${blogId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "BlogPost", id }, { type: "BlogPost", id: "LIST" }],
    }),


    // update a blog post owned by the author
    updateBlogPostByAuthor: builder.mutation<SingleBlogObject, { blogId: string; data: Partial<CreateBlogPostPayload> }>({
      query: ({ blogId, data }) => ({
        url: `/blogs/me/${blogId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "BlogPost", id: "LIST" }],
    }),


  }),
});

// Export hooks
export const {
  useGetBlogsQuery,
  useCreateBlogPostMutation,
  useDeleteBlogPostMutation,
  useGetBookmarkedBlogsQuery,
  useBookmarkBlogMutation,
  useRemoveBookmarkMutation,
  useDeleteBlogPostByAuthorMutation,
  useUpdateBlogPostByAuthorMutation,
} = blogApi;