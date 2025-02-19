'use client';

import React, { useState, useEffect } from 'react';
import { MdTipsAndUpdates } from "react-icons/md";
import AppointmentCard from './AppointmentCard';
import FromBlogs from './FromBlogs';
import MedicationList from './MedicationList';
import RecentVisits from './RecentVisits';

const messages = [
  "all patients that have not received their reloresult for medication treatment will need to ensure they stay Medicated every once in a while",
//   "interacting with a patient in a respectful and ethical manner will increase your rating and bring you to the top",
//   "your rating will fully depend on the review given by the patients. so make sure to satisfy them"
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
    <div className=' min-h-screen space-y-6 mr-5'>
      <h2 className='text-start text-xl px-6 md:px-0'>Welcome Back Mr. Aweke</h2>
      <div className="bg-[#FFA07A] text-white p-4 flex justify-between items-center rounded-3xl">
        <div className="flex items-center gap-2">
          <MdTipsAndUpdates className='text-primaryColor' size={40}/>
          <div className="flex flex-col items-start gap-1">
            <p className='font-bold'>New update for patients</p>
            <p>{currentMessage}</p>
          </div>
        </div>
      </div>
      <div className='xl:flex'>

      <AppointmentCard
        doctorName="Dr. Ermiyas Kinde,.Ms."
        specialty="Orthopedist Specialist"
        date="12/23/34"
        status="Accepted"
        address="Arada Street"
        contact="0909818109"
        imageUrl="/images/doctor3.svg" // Ensure this image exists in the public folder
      />
      <FromBlogs
        blogs={[
            {
            doctorName: 'Dr. Ermiya Kinde, MS.',
            specialty: 'Orthopedist Specialist',
            imageUrl: '/images/doctor3.svg',
            description: 'Eating a variety of foods from all food groups ensures that you get all necessary nutrients.',
            statusColor: 'bg-green-500',
            },
            {
            doctorName: 'Dr. Senayt Alemu, MS.',
            specialty: 'Hearts Specialist',
            imageUrl: '/images/doctor2.svg',
            description: 'Aim for at least 150 minutes of moderate-intensity aerobic physical activity or 75 minutes of vigorous-intensity activity each week,',
            statusColor: 'bg-red-500',
            },
            {
            doctorName: 'Dr. Senayt Alemu, MS.',
            specialty: 'Hearts Specialist',
            imageUrl: '/images/doctor4.svg',
            description: 'Adults should aim for 7-9 hours of quality sleep per night. Good sleep is essential for mental and physical health',
            statusColor: 'bg-green-500',
            },
        ]}
        />
      </div>
      <div className="xl:flex xl:gap-4">
        <MedicationList />
        <RecentVisits />
      </div>

    </div>
  )
}

export default Dashboard
