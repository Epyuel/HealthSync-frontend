import Dashboard from '@/appPages/doctor/Dashboard'
import Link from 'next/link'
import React from 'react'
import { IoChatbubbleSharp } from 'react-icons/io5'

const page = () => {
  return (
<div className="relative">
    <div>
      <Dashboard />
    </div>
        <Link href='/patient/chat' className='absolute bottom-0 right-0 p-4 translate-y-20 flex items-center justify-center'>
        <IoChatbubbleSharp className='text-primaryColor' size={80}/>
        <span className='absolute text-white text-md font-bold'>Your AI</span>
      </Link>
</div>
  )
}

export default page
