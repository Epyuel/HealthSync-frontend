'use client';

import React, { useState } from "react";
import Image from "next/image";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import ppimage from '@/public/images/doctor.png';
import { HiMenu } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import SearchComponent from "@/components/common-components/SearchComponent";



const dummyData = [
    { id: 1, date: "23/12/24", patient: "Abebe Kebede", diagnosis: "Hypertension", contact: "+251-911-123456" },
    { id: 2, date: "22/12/24", patient: "Tigist Alemu", diagnosis: "Diabetes", contact: "+251-911-654321" },
    { id: 3, date: "21/12/24", patient: "Bekele Dinku", diagnosis: "Asthma", contact: "+251-922-789012" },
    { id: 4, date: "20/12/24", patient: "Mulu Solomon", diagnosis: "Pneumonia", contact: "+251-933-234567" },
    { id: 5, date: "19/12/24", patient: "Hana Tadesse", diagnosis: "Arthritis", contact: "+251-944-345678" },
    { id: 6, date: "18/12/24", patient: "Getachew Yonas", diagnosis: "Migraine", contact: "+251-955-456789" },
    { id: 7, date: "17/12/24", patient: "Sofia Mesfin", diagnosis: "Allergy", contact: "+251-966-567890" },
    { id: 8, date: "16/12/24", patient: "Dawit Welde", diagnosis: "Gastritis",  contact: "+251-977-678901" },
    { id: 9, date: "15/12/24", patient: "Yohannes Berhane", diagnosis: "Flu", contact: "+251-988-789012" },
    { id: 10, date: "14/12/24", patient: "Eden Assefa", diagnosis: "Bronchitis", contact: "+251-999-890123" },
    { id: 11, date: "13/12/24", patient: "Tesfaye Alem", diagnosis: "Sinusitis", contact: "+251-911-901234" },
    { id: 12, date: "12/12/24", patient: "Mekdes Haile", diagnosis: "Anemia", contact: "+251-922-012345" },
    { id: 13, date: "11/12/24", patient: "Dereje Fekadu", diagnosis: "Back Pain", contact: "+251-933-123456" },
    { id: 14, date: "10/12/24", patient: "Birhanu Tesfaye", diagnosis: "Depression", contact: "+251-944-234567" },
    { id: 15, date: "09/12/24", patient: "Lemlem Ayalew", diagnosis: "Fracture", contact: "+251-955-345678" },
    { id: 16, date: "08/12/24", patient: "Yared Desta", diagnosis: "Chickenpox", contact: "+251-966-456789" },
    { id: 17, date: "07/12/24", patient: "Senait Gashaw", diagnosis: "Malaria", contact: "+251-977-567890" },
    { id: 18, date: "06/12/24", patient: "Samuel Kidane", diagnosis: "Typhoid", contact: "+251-988-678901" },
    { id: 19, date: "05/12/24", patient: "Rahel Meseret", diagnosis: "Dengue", contact: "+251-999-789012" },
    { id: 20, date: "04/12/24", patient: "Fikadu Abera", diagnosis: "Appendicitis", contact: "+251-911-890123" }
  ];

const ITEMS_PER_PAGE = 7;

const MedicalHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(dummyData);
  const totalPages = Math.ceil(dummyData.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: any) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="mr-5">
      {/* Profile Section */}
      <div className="flex justify-between items-center shadow-sm py-3 w-full">
        <div className="flex items-center">
            <Image src={ppimage} alt="Profile" width={70} height={70} className="rounded-full" />
            <div>
                <h2 className="text-lg font-semibold">Dr. Demsew</h2>
                <p className="text-sm text-gray-500">Orthodontist - Addis Ababa, Ethiopia</p>
            </div>
        </div>
        <Link href='/doctor/accounts' className="ml-auto px-4 py-2 text-sm text-white bg-primaryColor rounded">Edit Profile</Link>
      </div>

      {/* Medical History Table */}
      <div className="mt-6 bg-white shadow rounded-lg p-4 w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Medical History</h3>
          <div className="flex items-center space-x-4">
            <SearchComponent
                  data={dummyData}
                  value="patient"
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
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Last Visit</th>
              <th className="p-2">Patient</th>
              <th className="p-2">Diagnosis</th>
              <th className="p-2">Contact</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((entry) => (
              <tr key={entry.id} className="border-b">
                <td className="p-2">{entry.date}</td>
                <td className="p-2">{entry.patient}</td>
                <td className="p-2 text-blue-500">{entry.diagnosis}</td>
                <td className="p-2">{entry.contact}</td>
                <td className="p-2">
                  <button className="px-4 py-1 text-sm text-white bg-secondaryColor rounded">More</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination className="mt-4 w-full">
        <PaginationContent>
          <PaginationPrevious onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} />
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink onClick={() => handlePageChange(i + 1)} isActive={currentPage === i + 1}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationNext onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} />
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default MedicalHistory;
