import Dashboard from '@/pages/doctor/Dashboard'
import Link from 'next/link'
import React from 'react'
import { IoChatbubbleSharp } from 'react-icons/io5'

const page = () => {
  return (
<div className="">
    <div className=''>
      <Dashboard />
    </div>
      <Link href='/doctor/chat' className='absolute bottom-10 right-0 p-4 translate-y-20 flex items-center justify-center'>
        <IoChatbubbleSharp className='text-primaryColor' size={80}/>
        <span className='absolute text-white text-md font-bold'>Your AI</span>
      </Link>
</div>
  )
}

export default page
