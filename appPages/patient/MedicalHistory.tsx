'use client';
import React, { useState } from "react";
import Image from "next/image";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import ppimage from '@/public/images/doctor.png';
import { HiMenu } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SearchComponent from "@/components/common-components/SearchComponent";

const dummyData = [
  { id: 1, date: "23/12/24", doctor: "Abebe Kebede", rating: 3, contact: "+251-911-123456" },
  { id: 2, date: "22/12/24", doctor: "Tigist Alemu", rating: 3.3, contact: "+251-911-654321" },
  { id: 3, date: "21/12/24", doctor: "Bekele Dinku", rating: 5, contact: "+251-922-789012" },
  { id: 4, date: "20/12/24", doctor: "Mulu Solomon", rating: 5, contact: "+251-933-234567" },
  { id: 5, date: "19/12/24", doctor: "Hana Tadesse", rating: 2.5, contact: "+251-944-345678" },
  { id: 6, date: "18/12/24", doctor: "Getachew Yonas", rating: 4, contact: "+251-955-456789" },
  { id: 7, date: "17/12/24", doctor: "Sofia Mesfin", rating: 5, contact: "+251-966-567890" },
  { id: 8, date: "16/12/24", doctor: "Dawit Welde", rating: 4.1,  contact: "+251-977-678901" },
  { id: 9, date: "15/12/24", doctor: "Yohannes Berhane", rating: 1.4, contact: "+251-988-789012" },
  { id: 10, date: "14/12/24", doctor: "Eden Assefa", rating: 5, contact: "+251-999-890123" },
  { id: 11, date: "13/12/24", doctor: "Tesfaye Alem", rating: 4.4, contact: "+251-911-901234" },
  { id: 12, date: "12/12/24", doctor: "Mekdes Haile", rating: 4.7, contact: "+251-922-012345" },
  { id: 13, date: "11/12/24", doctor: "Dereje Fekadu", rating: 3.3, contact: "+251-933-123456" },
  { id: 14, date: "10/12/24", doctor: "Birhanu Tesfaye", rating: 4.6, contact: "+251-944-234567" },
  { id: 15, date: "09/12/24", doctor: "Lemlem Ayalew", rating: 4.5, contact: "+251-955-345678" },
  { id: 16, date: "08/12/24", doctor: "Yared Desta", rating: 5, contact: "+251-966-456789" },
  { id: 17, date: "07/12/24", doctor: "Senait Gashaw", rating: 4, contact: "+251-977-567890" },
  { id: 18, date: "06/12/24", doctor: "Samuel Kidane", rating: 5, contact: "+251-988-678901" },
  { id: 19, date: "05/12/24", doctor: "Rahel Meseret", rating: 3.8, contact: "+251-999-789012" },
  { id: 20, date: "04/12/24", doctor: "Fikadu Abera", rating: 4.7, contact: "+251-911-890123" }
];


const ITEMS_PER_PAGE = 5;

const PatientMedicalHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(dummyData);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="mx-4 md:mr-5">
      {/* Profile Section */}
      <div className="flex justify-between items-center shadow-sm py-3 w-full">
        <div className="flex items-center">
          <Image src={ppimage} alt="Profile" width={70} height={70} className="rounded-full" />
          <div>
            <h2 className="text-lg font-semibold">Dr. Demsew</h2>
            <p className="text-sm text-gray-500">Orthodontist - Addis Ababa, Ethiopia</p>
          </div>
        </div>
        <Link href='/doctor/accounts' className="ml-auto px-4 py-2 text-sm text-white bg-primaryColor rounded">
          Edit Profile
        </Link>
      </div>

      {/* Medical History Table */}
      <div className="mt-6 bg-white shadow rounded-lg w-full overflow-x-auto">
        <div className="p-4">
          {/* Updated Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
            <h3 className="text-xl font-semibold mb-2 md:mb-0">Medical History</h3>
            <div className="flex flex-col sm:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
              {/* Integrating the SearchComponent */}
              <SearchComponent
                data={dummyData}
                value="doctor"
                onFilter={setFilteredData}
              />

              <Select>
                <SelectTrigger>Sort by: Newest</SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <table className="min-w-[600px] w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Last Visit</th>
                <th className="p-2">Doctor</th>
                <th className="p-2">Rating</th>
                <th className="p-2">Contact</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((entry) => (
                <tr key={entry.id} className="border-b">
                  <td className="p-2">{entry.date}</td>
                  <td className="p-2">{entry.doctor}</td>
                  <td className="p-2 text-blue-500">{entry.rating} / 5</td>
                  <td className="p-2">{entry.contact}</td>
                  <td className="p-2">
                    <button className="px-4 py-1 text-sm text-white bg-secondaryColor rounded">More</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination className="mt-4 w-full">
        <PaginationContent>
          <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink onClick={() => handlePageChange(i + 1)} isActive={currentPage === i + 1}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PatientMedicalHistory;
