// SavedBlogs.tsx
import Image from 'next/image';
import React from 'react';
import imgg from '@/public/images/doctor.png'
import { FaBookmark } from "react-icons/fa";


interface Advice {
  id: number;
  name: string;
  title: string;
  message: string;
  status: string;
}

const SavedadviceData: Advice[] = [
  {
    id: 1,
    name: 'Dr. Emmiyas Kindie, M.D.',
    title: 'Orthopedics Specialist',
    message: 'Getting enough sleep is essential for your overall health. Adults should aim for 7-9 hours of sleep per night. Good sleep hygiene practices include maintaining a regular sleep schedule, creating a comfortable sleep environment, and avoiding caffeine and electronic devices before bedtime. Quality sleep helps to improve concentration, mood, and overall physical health.',
    status: 'saved'
  },
  {
    id: 2,
    name: 'Dr. Emmiyas Kindie, M.D.',
    title: 'Orthopedics Specialist',
    message: 'Managing stress is important for maintaining good health. Chronic stress can have negative effects on both your physical and mental health. Practice stress-reducing techniques such as deep breathing, meditation, yoga, or engaging in hobbies that you enjoy. It is also important to maintain a strong support system of family and friends to help you cope with stressful situations.',
    status: 'saved'
  },
];

const SavedBlogs: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="grid gap-4">
        {SavedadviceData.map((advice) => (
          <div
            key={advice.id}
            className="bg-[#fff5f5] rounded-lg p-4 shadow-md border border-[#ffcccc] flex items-start"
          >
            <Image

              src={imgg}
              alt={`${advice.name} profile`}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h3 className="font-semibold text-gray-800">{advice.name}</h3>
              <p className="text-sm text-gray-600">{advice.title}</p>
              <p className="mt-2 text-gray-800">{advice.message}</p>
            </div>
            <button className="">
              <FaBookmark className='text-[#ff8787] hover:text-[#ff4949]' size={35}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedBlogs;