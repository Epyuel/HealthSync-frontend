import React from 'react';
// import { FaBell } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { HiMenu } from "react-icons/hi";
// import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Link from 'next/link';
// import Notification from '../common-components/Notification';
import { NotificationModel } from '../models/notification';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Logout from '../auth/Logout';
import { FaSignOutAlt } from "react-icons/fa";

const notifications: NotificationModel[] = [
  {
    id: '1',
    targetID: 'e8e8-455r',
    triggerID: "@Mihret223",
    message: "has requested your service.\nName:Mihret\nage:23\nGender:Female",
    time: "9:42 AM",
    type: "visitRequest"
  },
  {
    id: '2',
    targetID: 'e8e8-455r',
    triggerID: "@hunban",
    message: "You have an appointment in 2 days.",
    time: "Last Wednesday at 9:42 AM",
    type: "noAction"
  },
];

const AdminNavbar = ({ onMenuClick }: { onMenuClick: () => void }) => {

  return (
    <nav className="sticky top-0 bg-white border-b-2 flex items-center justify-between px-6 py-3 z-20">
      <div className="flex items-center relative w-80">
        <button
          className="md:hidden mr-4"
          onClick={onMenuClick}
          aria-label="Menu-Icon"
        >
          <HiMenu size={24} />
        </button>
      </div>

      <div className="flex items-center space-x-4 BORDER border-black">
        <Link href='' className=" space-x-2 text-sm text-gray-700 focus:outline-none">
          <div className="w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center text-white">
            A
          </div>
        </Link>
        {/* <Popover>
            <PopoverTrigger asChild>
              <button>
                <FaBell className='text-[#B0C3CC]' size={25}/>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 h-64 bg-[#e3ffff] shadow-lg rounded-lg mr-2">
              <Notification notifications={notifications} />
            </PopoverContent>
          </Popover> */}
        <div className="relative">
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <FaSignOutAlt className='text-[#B0C3CC] hover:text-red-500' size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <Logout />  {/* Render Logout inside PopoverContent */}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
