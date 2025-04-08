import React, { useEffect, useRef, useState } from 'react';
import { FaBell } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { HiMenu } from "react-icons/hi"; 
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Link from 'next/link';
import Notification from '../common-components/Notification';
import { NotificationModel } from '../models/notification';
import { Row, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useGetVerifiedDoctorsQuery } from '@/redux/api/doctorApi';
import { LoadingOutlined } from '@ant-design/icons';
import { DoctorModel } from '../models/doctor';
import { useSessionUser } from '../context/Session';
import { PatientModel } from '../models/patient';


const notifications: NotificationModel[] = [
  {
    id: '1',
    targetID:'e8e8-455r',
    triggerID: "@Mihret223",
    message: "has requested your service.",
    time: "9:42 AM",
    type: "visitRequest"
  },
  {
    id: '2',
    targetID:'e8e8-455r',
    triggerID: "@hunban",
    message: "You have an appointment in 2 days.",
    time: "Last Wednesday at 9:42 AM",
    type: "noAction"
  },
];

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => { 
  const {user}:{user?:PatientModel} = useSessionUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<any>(null);

  const { data, status, error, isLoading } = useGetVerifiedDoctorsQuery();
  const doctors:DoctorModel[] = data?.data?.doctors || [];

  // Close the modal if the user clicks outside the container
  useEffect(() => {
    const handleClickOutside = (event:MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredResults = doctors?.filter((doctor) =>
    `Dr. ${doctor.firstname} ${doctor.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
  )??[];

  return (
    <nav ref={containerRef} className="sticky top-0 bg-white border-b-2 flex items-center justify-between px-6 py-3 z-20">
      <div className="flex items-center relative w-96">
        <button
          className="md:hidden mr-4"
          onClick={onMenuClick}
          aria-label="Menu-Icon"
        >
          <HiMenu size={24} />
        </button>
        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#F6F6FB] pr-10 w-full rounded-lg"
          onClick={() => setIsOpen(true)}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {isOpen && (
          <div className="absolute top-8 left-0 right-0 mt-2 bg-white shadow-lg rounded-lg p-4 border max-h-[30rem] overflow-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Search Results</span>
            </div>

            {
              error?
              <Row align='middle' justify='center'>
                <p className="text-sm text-gray-500">Something went wrong</p>
              </Row>

              :isLoading?
              <Row align='middle' justify='center'>
                <Spin indicator={<LoadingOutlined spin/>}/>
              </Row>

              :filteredResults.length > 0 ? (
                <ul>
                  {filteredResults.map((doctor, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-100 rounded cursor-pointer border-b-2"
                      onClick={()=>{
                        router.push(`/patient/search?key=${doctor._id}`);
                        setIsOpen(false);
                      }}
                    >
                      <Row className='gap-3 items-center'>
                        <div className="w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center text-white">
                          {doctor.firstname.at(0)??'U'}
                        </div>
                        <Row className='flex-col'>
                          <span className='font-semibold'>Dr. {doctor.firstname} {doctor?.lastname?.at(0)?.toUpperCase()}.</span>
                          <span className='text-[13px] text-gray-500'>{doctor.email}</span>
                        </Row>
                      </Row>
                      <Row className='gap-x-3 gap-y-2 justify-between mt-2'>
                        <span className='text-sm text-gray-500'>📍 {doctor?.hospital.address.city}</span>
                        <span className='text-sm text-gray-500'>🏨 {doctor?.hospital.name}</span>
                        <span className='text-sm text-gray-500'>🩺 {doctor.specializations.join(', ')}</span>
                      </Row>
                    </li>
                  ))}
                </ul>
              ) 

              : <Row><p className="text-sm text-gray-500">No data</p></Row>
            }

          </div>
        )}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <CiSearch className='text-[#B0C3CC]' size={20}/>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Link href='/patient/accounts' className="flex items-center space-x-2 text-sm text-gray-700 focus:outline-none">
            <div className="w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center text-white">
              P
            </div>
            <span className="hidden sm:inline">{user?.firstname}</span> 
          </Link>
        </div>

        <div className="relative">
          <Popover>
            <PopoverTrigger asChild>
              <button>
                <FaBell className='text-[#B0C3CC]' size={25}/>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 h-64 bg-[#e3ffff] shadow-lg rounded-lg mr-2">
              <Notification notifications={notifications} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;