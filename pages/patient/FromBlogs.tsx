'use client';

import Image from 'next/image';
import { FC } from 'react';

interface BlogProps {
  doctorName: string;
  specialty: string;
  imageUrl: string;
  description: string;
  statusColor: string;
}

const FromBlogs: FC<{ blogs: BlogProps[] }> = ({ blogs }) => {
  return (
    <div className='md:w-3/4'>
      <h2 className="text-lg font-semibold text-gray-800 pl-5 py-3">From Blogs</h2>
    <div className="xl:h-[313px] p-4 ml-6 bg-white shadow-lg rounded-lg border border-gray-200">
      {blogs.map((blog, index) => (
        <div key={index} className="grid xl:grid-cols-[auto,1fr] gap-4 py-3 border-b last:border-b-0 items-center">

          <div className="flex items-center space-x-4 relative">
            <div className="relative w-12 h-12">
              <Image
                src={blog.imageUrl}
                alt={blog.doctorName}
                width={50}
                height={50}
                className="rounded-full"
              />
              <span
                className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${blog.statusColor}`}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{blog.doctorName}</h3>
              <p className="text-sm text-gray-500">{blog.specialty}</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">{blog.description}</p>
        </div>
      ))}
    </div>
    </div>
  );
};

export default FromBlogs;
