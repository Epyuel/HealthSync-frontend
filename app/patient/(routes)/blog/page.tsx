'use client';
import Link from 'next/link';
import React, { useState } from 'react'

import Blog from '@/appPages/patient/Blog';
import SavedBlogs from '@/appPages/patient/SavedBlogs';


const Blogpage = () => {
  const [index, setindex] = useState(0)
  return (
    <div className='space-y-8'>
      <h1 className='font-bold text-xl'>Blogs</h1>
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <div className="list-group flex items-center border-b-2 w-fit gap-8">
              <Link href="" className={`list-group-item list-group-item-action italic ${index === 0 ? "border-b-4 border-primaryColor text-secondaryColor" : ""}`} onClick={() => setindex(0)}>All</Link>
              <Link href="" className={`list-group-item list-group-item-action italic ${index === 1 ? "border-b-4 border-primaryColor text-secondaryColor" : ""}`} onClick={() => setindex(1)}>Saved</Link>
            </div>
          </div>
          <div className="col-md-9 py-8 px-8">
            {index === 0 && <Blog />}
            {index === 1 && <SavedBlogs />}
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Blogpage
