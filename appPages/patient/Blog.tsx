import Image from 'next/image';
import React from 'react';
import imgg from '@/public/images/doctor.png';
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useGetBlogsQuery, useBookmarkBlogMutation, useRemoveBookmarkMutation } from '@/redux/api/blogApi';
import { BlogPost } from '@/types/blog';
import { toast } from 'react-toastify';

const Blog: React.FC = () => {
  const { data: blogs, isLoading, isError, refetch } = useGetBlogsQuery({});
  const [bookmarkBlog] = useBookmarkBlogMutation();
  const [removeBookmark] = useRemoveBookmarkMutation();

  const handleBookmarkToggle = async (blogId: string, isCurrentlyBookmarked: boolean) => {
    try {
      if (isCurrentlyBookmarked) {
        await removeBookmark({ blogId }).unwrap();
        toast.success('Removed from saved articles');
      } else {
        await bookmarkBlog({ blogId }).unwrap();
        toast.success('Added to saved articles');
      }
      refetch(); // Refresh the list to update the UI
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading blogs</div>;

  return (
    <div className="container mx-auto">
      <div className="grid gap-4">
        {blogs?.data?.blogs.map((blog: BlogPost) => (
          <div
            key={blog._id}
            className="bg-[#fff5f5] rounded-lg p-4 shadow-md border border-[#ffcccc] flex items-start"
          >
            <Image
              src={imgg}
              alt={`${blog.author} profile`}
              className="w-16 h-16 rounded-full mr-4"
              width={64}
              height={64}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{blog.author}</h3>
              <p className="text-sm text-gray-600">{blog.title}</p>
              <p className="mt-2 text-gray-800">{blog.content}</p>
            </div>
            <button 
              onClick={() => handleBookmarkToggle(blog._id, blog.isBookmarked)}
              className="ml-4 hover:scale-110 transition-transform"
              aria-label={blog.isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {blog.isBookmarked ? (
                <FaBookmark className='text-[#ff4949]' size={35}/>
              ) : (
                <FaRegBookmark className='text-[#ff8787] hover:text-[#ff4949]' size={35}/>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;