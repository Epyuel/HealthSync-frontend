'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail } from "lucide-react";

const recentVisits = [
  { doctor: "Dr Bekele", specialty: "Upper Abdomen General" },
  { doctor: "Dr Habtamu", specialty: "Gynecologic Disorders" },
  { doctor: "Dr Habtamu", specialty: "Gynecologic Disorders" }
];

const RecentVisits = () =>  {
  return (
    <div className="mt-4 xl:ml-16 ml-2">
        <h2 className="text-lg font-semibold mb-4">Recent Visits</h2>
        <div className="w-[571px] h-[254px] p-4 bg-white rounded-2xl shadow-md">
          <Table>
            <TableHeader className="p-4">
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead className="text-center">Send Invitation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentVisits.map((visit, index) => (
                <TableRow key={index} className="p-4">
                  <TableCell className="py-5">{visit.doctor}</TableCell>
                  <TableCell className="py-5">{visit.specialty}</TableCell>
                  <TableCell className="pl-14 py-5">
                    <Mail className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
    </div>
      );
}

export default RecentVisits;
