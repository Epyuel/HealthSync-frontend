export interface BlogPost {
    _id: string;
    author: string;
    title: string;
    content: string;
    tags?: string[];
    publishedAt: string;
    doctor?: {
      name: string;
      specialty?: string;
    };
    isBookmarked: boolean;
  }
  
  export interface BlogResponse {
    success: boolean;
    data: {
      blogs: BlogPost[];
    };
  }
  export interface CreateBlogPostPayload {
    author: string;
    title: string;
    content: string;
    tags?: string[];
    thumbnail?: string;
    published?: boolean;
    publishedAt?: string;
  }
  // types/blog.ts


