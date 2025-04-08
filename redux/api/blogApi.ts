import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store"; // Adjust the import path as necessary
import type { BlogResponse, CreateBlogPostPayload } from '@/types/blog';

export const blogApi = createApi({
  reducerPath: "blogApi", // Unique key for this API slice
  baseQuery: fetchBaseQuery({
    baseUrl: "https://healthsync-backend-bfrv.onrender.com/api",
    credentials: "include",
    // prepareHeaders: (headers) => {
    //     // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2RkNmY0MGZmNzU3YjJjZmQyNjI4NDQiLCJmaXJzdG5hbWUiOiJtZWxha2VzZWxhbSIsImxhc3RuYW1lIjoieWl0YmFyZWsiLCJlbWFpbCI6Im1lbGFrZXNlbGFteWl0YmFyZWsyMDEyQGdtYWlsLmNvbSIsImFnZSI6MjMsImdlbmRlciI6Im1hbGUiLCJwaG9uZU51bWJlciI6IjI1MTk2MjIxMjgxOCIsInNwZWNpYWxpemF0aW9ucyI6WyJDYXJkaW9sb2d5Il0sInF1YWxpZmljYXRpb25zIjpbIk1CQlMiXSwibGljZW5zZXMiOlt7InVybCI6Imh0dHBzOi8vcmVzLmNsb3VkaW5hcnkuY29tL2RyejlhYTU1ay9pbWFnZS91cGxvYWQvdjE3NDI1NjUxMjgvZ3ZjN2Z5N2gyeGNkZ3lkb3k4OHIucGRmIiwidHlwZSI6InBkZiIsImlzVmVyaWZpZWQiOmZhbHNlLCJfaWQiOiI2N2RkNmY0MGZmNzU3YjJjZmQyNjI4NDUifV0sInJvbGUiOiJkb2N0b3IiLCJfX3YiOjAsImlhdCI6MTc0MzA3NzIyNX0.gIwkIVOYe61syNXYW3BKMVqAa2wdETrcH62LvT1Uk3U"; // Replace with your actual token
        
    //     // if (token) {
    //     //   headers.set("Authorization", `Bearer ${token}`);
    //     // }
      
    //     return headers;
    //   }
      
    
    }),
  tagTypes: ["BlogPost"], // For cache invalidation
  endpoints: (builder) => ({
    // Fetch all blogs (with optional filters)
    getBlogs: builder.query<BlogResponse, { author_id?: string; tag?: string }>({
        query: (params) => ({
        
        url: "/blogs",
        
        method: "GET",
        params, // Automatically converts to `/blogs?author_id=123&tag=health`
      }),
      
      providesTags: (result) => 
        result?.data?.blogs 
          ? [...result.data.blogs.map(({ _id }) => ({ type: 'BlogPost' as const, id: _id }))]
          : ['BlogPost'],    }),
// Fetch bookmarked blogs for current user
getBookmarkedBlogs: builder.query<BlogResponse, void>({
  query: () => "/blogs/bookmarks/me",
  providesTags: ['BlogPost'],
}),

// Bookmark a blog
bookmarkBlog: builder.mutation<void, { blogId: string }>({
  query: ({ blogId }) => ({
    url: `/blogs/${blogId}/bookmark`,
    method: 'POST',
  }),
  invalidatesTags: ['BlogPost'],
}),
// Remove bookmark from a blog
removeBookmark: builder.mutation<void, { blogId: string }>({
  query: ({ blogId }) => ({
    url: `/blogs/${blogId}/bookmark`,
    method: 'DELETE',
  }),
  invalidatesTags: ['BlogPost'],
}),
    // Create a blog post
    createBlogPost: builder.mutation<BlogPost, CreateBlogPostPayload>({
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
        invalidatesTags: ["BlogPost"],
      }),

    // Delete a blog post
    deleteBlogPost: builder.mutation<void, string>({
      query: (blogId) => ({
        url: `/blogs/${blogId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlogPost"],
    }),
  }),
});

// Types
interface BlogPost {
  id: string;
  author: string; // Doctor ID
  title: string;
  content: string;
  tags?: string[];
  publishedAt: string;
}



// Export hooks
export const {
  useGetBlogsQuery,
  useCreateBlogPostMutation,
  useDeleteBlogPostMutation,
  useGetBookmarkedBlogsQuery,
  useBookmarkBlogMutation,
  useRemoveBookmarkMutation,
} = blogApi;