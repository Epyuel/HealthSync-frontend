import Image from 'next/image';
import React from 'react';
import imgg from '@/public/images/doctor.png';
import { FaBookmark, FaBookOpen } from "react-icons/fa";
import { useGetBookmarkedBlogsQuery } from '@/redux/api/blogApi';
import { BlogPost } from '@/types/blog';

const SavedBlogs: React.FC = () => {
  const { data: savedBlogs, isLoading, isError } = useGetBookmarkedBlogsQuery();

  if (isLoading) return <div className="text-center py-8">Loading saved blogs...</div>;
  if (isError) return <div className="text-center py-8 text-red-500">Error loading saved blogs</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {savedBlogs?.data?.blogs && savedBlogs.data.blogs.length > 0 ? (
        <div className="grid gap-6">
          {savedBlogs.data.blogs.map((blog: BlogPost) => (
            <div
              key={blog._id}
              className="bg-[#fff5f5] rounded-lg p-6 shadow-md border border-[#ffcccc] flex items-start"
            >
              <Image
                src={imgg}
                alt={`${blog.author} profile`}
                className="w-16 h-16 rounded-full mr-6"
                width={64}
                height={64}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">{blog.author}</h3>
                <p className="text-sm text-gray-600 mb-2">{blog.title}</p>
                <p className="mt-2 text-gray-800">{blog.content}</p>
              </div>
              <button className="ml-4 self-start" aria-label="Bookmarked">
                <FaBookmark className='text-[#ff4949]' size={35}/>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="flex justify-center mb-4 text-gray-400">
            <FaBookOpen className="text-5xl" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Saved Articles Yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            You haven't bookmarked any articles. Click the bookmark icon on articles to save them here.
          </p>
        </div>
      )}
    </div>
  );
};

export default SavedBlogs;