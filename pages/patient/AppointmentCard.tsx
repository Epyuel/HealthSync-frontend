'use client';

import Image from 'next/image';
import { FC } from 'react';

interface AppointmentCardProps {
  doctorName: string;
  specialty: string;
  date: string;
  status: string;
  address: string;
  contact: string;
  imageUrl: string;
}

const AppointmentCard: FC<AppointmentCardProps> = ({
  doctorName,
  specialty,
  date,
  status,
  address,
  contact,
  imageUrl,
}) => {
  return (
    <div className='md:w-2/3 xl:w-1/3'>
      <h2 className='text-start text-lg font-semibold text-gray-800 pl-5 py-3'>Appointments</h2>
    <div className="xl:h-[313px] px-8 py-2 bg-[#FBFCFE] shadow-lg rounded-lg border border-gray-200 flex flex-col items-center">
      <div className="mt-2 rounded-lg flex items-center">
        <Image
          src={imageUrl}
          alt="Doctor"
          width={50}
          height={50}
          className="rounded-full"
        />
        <div className="ml-4">
          <h3 className="font-bold text-gray-800">{doctorName}</h3>
          <p className="text-sm ml-2 text-gray-500">{specialty}</p>
        </div>
      </div>
      <div className="mt-6 px-4 space-y-3 text-sm w-full">
        <div className="flex justify-between w-full border-b border-gray-200">
          <span className=" text-[#737B8B] mb-2">Date</span>
          <span className='text-[#737B8B]'>{date}</span>
        </div>
        <div className="flex justify-between w-full border-b border-gray-200">
          <span className="text-[#737B8B] mb-2">Status</span>
          <span className={status === 'Accepted' ? 'text-green-500' : 'text-red-500'}>
            {status}
          </span>
        </div>
        <div className="flex justify-between w-full border-b border-gray-200">
          <span className="text-[#737B8B] mb-2">Address</span>
          <span className="text-red-400">{address}</span>
        </div>
        <div className="flex justify-between w-full border-b border-gray-200">
          <span className="text-[#737B8B] mb-2">Contact</span>
          <span className='text-[#737B8B]'>{contact}</span>
        </div>
      </div>
      <button className="mt-4 w-4/5 bg-[#FFA07A] text-white py-2 rounded-lg hover:bg-orange-500 transition">
        Cancel
      </button>
    </div>
    </div>
  );
};

export default AppointmentCard;