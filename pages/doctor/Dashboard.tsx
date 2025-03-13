'use client';
import Analysis from '@/components/doctor-components/Analysis'
import React, { useState, useEffect } from 'react';
import RatingReport from '@/components/doctor-components/RatingReport'
import { MdTipsAndUpdates } from "react-icons/md";

const messages = [
  "posting more education content will increase your exposure through out the platform",
  "interacting with a patient in a respectful and ethical manner will increase your rating and bring you to the top",
  "your rating will fully depend on the review given by the patients. so make sure to satisfy them"
];

const Dashboard = () => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prevMessage => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='min-h-screen space-y-6 mr-5 pb-10'>
      <div className="bg-[#FFA07A] text-white p-4 flex justify-between items-center rounded-3xl">
        <div className="flex items-center gap-2">
          <MdTipsAndUpdates className='text-primaryColor' size={40}/>
          <div className="flex flex-col items-start gap-1">
            <p className='font-bold'>Reminder for doctors</p>
            <p>{currentMessage}</p>
          </div>
        </div>
      </div>
      <h2 className='text-start text-xl px-6 md:px-0'>Welcome Back Dr!</h2>
      <div className='w-full mb-20'>
        <Analysis/>
        <RatingReport/>
      </div>
    </div>
  )
}

export default Dashboard
