// Blog.tsx
import Image from 'next/image';
import React from 'react';
import imgg from '@/public/images/doctor.png'
import { Button } from '@/components/ui/button';
import { FaBookmark } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
interface Advice {
    id: number;
    name: string;
    title: string;
    message: string;
    status: string;
  }
  
// Sample data (you can replace this with dynamic data from a state or API)
const adviceData: Advice[] = [
  {
    id: 1,
    name: 'Dr. Emmiyas Kindie, M.D.',
    title: 'Orthopedics Specialist',
    message: 'Eating a variety of foods from all food groups ensures that you get all necessary nutrients. It is important to include fruits, vegetables, grains, protein, and dairy in your diet. Each food group provides different essential nutrients that your body needs to function properly. Additionally, staying hydrated and maintaining a balanced diet can help improve your overall health and well-being.',
    status: 'saved'
  },
  {
    id: 2,
    name: 'Dr. Emmiyas Kindie, M.D.',
    title: 'Orthopedics Specialist',
    message: 'Regular physical activity is crucial for maintaining good health. It helps to control weight, reduce the risk of chronic diseases, and improve mental health. Aim for at least 30 minutes of moderate-intensity exercise most days of the week. This can include activities such as walking, cycling, swimming, or any other form of exercise that you enjoy. Remember to start slowly and gradually increase the intensity and duration of your workouts.',
    status: 'unsaved'
  },
  {
    id: 3,
    name: 'Dr. Emmiyas Kindie, M.D.',
    title: 'Orthopedics Specialist',
    message: 'Getting enough sleep is essential for your overall health. Adults should aim for 7-9 hours of sleep per night. Good sleep hygiene practices include maintaining a regular sleep schedule, creating a comfortable sleep environment, and avoiding caffeine and electronic devices before bedtime. Quality sleep helps to improve concentration, mood, and overall physical health.',
    status: 'saved'
  },
  {
    id: 4,
    name: 'Dr. Emmiyas Kindie, M.D.',
    title: 'Orthopedics Specialist',
    message: 'Managing stress is important for maintaining good health. Chronic stress can have negative effects on both your physical and mental health. Practice stress-reducing techniques such as deep breathing, meditation, yoga, or engaging in hobbies that you enjoy. It is also important to maintain a strong support system of family and friends to help you cope with stressful situations.',
    status: 'unsaved'
  },
];

const Blog: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="grid gap-4">
        {adviceData.map((advice) => (
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
            {
                advice.status === 'unsaved' ? (
                    <button className="">
                        <FaRegBookmark className='text-[#ff8787] hover:text-[#ff4949]' size={35}/>
                    </button>
                ) : (
                  <button className="">
                        <FaBookmark className='text-[#ff8787] hover:text-[#ff4949]' size={35}/>
                    </button>
                )
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;