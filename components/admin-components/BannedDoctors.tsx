"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { Hospital, Phone, Mail, Calendar } from "lucide-react"

// Define the types based on the API response
interface Address {
  street: string
  city: string
  region: string
  country: string
  postalCode: string
}

interface HospitalType {
  address: Address
  _id: string
  name: string
  branch: number
}

interface License {
  url: string
  type: string
  isVerified: boolean
  _id: string
}

interface Doctor {
  _id: string
  firstname: string
  lastname: string
  email: string
  age: number
  gender: string
  phoneNumber: string
  specializations: string[]
  qualifications: string[]
  licenses: License[]
  hospital: HospitalType
  banned: boolean
  status: string
  createdAt: string
  updatedAt: string
}

const mockDoctors: Doctor[] = [
  {
    _id: "67eb15297db753f356e1173e",
    firstname: "Daniel",
    lastname: "Teka",
    email: "dani@gmail.com",
    age: 34,
    gender: "male",
    phoneNumber: "251987654321",
    specializations: ["Orthopedics"],
    qualifications: ["MCh"],
    licenses: [
      {
        url: "https://res.cloudinary.com/drz9aa55k/image/upload/v1743459612/yzs7uqn5gmhxlldpaeje.pdf",
        type: "pdf",
        isVerified: false,
        _id: "67eb15297db753f356e1173f",
      },
    ],
    hospital: {
      address: {
        street: "Bethel PO BOX 127",
        city: "Addis Ababa",
        region: "Addis Ababa",
        country: "Ethiopia",
        postalCode: "35324",
      },
      _id: "67e83e268439394e7ff2ee53",
      name: "Bethel General Hospital",
      branch: 2,
    },
    banned: true,
    status: "pending",
    createdAt: "2025-03-31T22:20:25.702Z",
    updatedAt: "2025-03-31T22:20:25.702Z",
  },
  {
    _id: "67eb16337db753f356e1174d",
    firstname: "Melakeselam",
    lastname: "Yitbarek",
    email: "melakeselamyitbarek2012@gmail.com",
    age: 23,
    gender: "male",
    phoneNumber: "251962212818",
    specializations: ["Neurology", "Cardiology"],
    qualifications: ["DO"],
    licenses: [
      {
        url: "https://res.cloudinary.com/drz9aa55k/image/upload/v1743459877/bm2cfkhvy3uomivtzqzg.pdf",
        type: "pdf",
        isVerified: false,
        _id: "67eb16337db753f356e1174e",
      },
    ],
    hospital: {
      address: {
        street: "Addis Ababa",
        city: "Addis Ababa",
        region: "Addis Ababa",
        country: "Ethiopia",
        postalCode: "1000",
      },
      _id: "67e83e148439394e7ff2ee51",
      name: "Teklehaymanot General Hospital",
      branch: 2,
    },
    banned: true,
    status: "pending",
    createdAt: "2025-03-31T22:24:51.806Z",
    updatedAt: "2025-03-31T22:24:51.806Z",
  },
  {
    _id: "67eb16337db753f356e1175e",
    firstname: "Abebe",
    lastname: "Bekele",
    email: "abebe@gmail.com",
    age: 45,
    gender: "male",
    phoneNumber: "251911223344",
    specializations: ["Pediatrics", "General Surgery"],
    qualifications: ["MD"],
    licenses: [
      {
        url: "https://example.com/license.pdf",
        type: "pdf",
        isVerified: false,
        _id: "67eb16337db753f356e1175f",
      },
    ],
    hospital: {
      address: {
        street: "Bole Road",
        city: "Addis Ababa",
        region: "Addis Ababa",
        country: "Ethiopia",
        postalCode: "1000",
      },
      _id: "67e83e148439394e7ff2ee52",
      name: "St. Paul's Hospital",
      branch: 1,
    },
    banned: true,
    status: "pending",
    createdAt: "2025-03-30T10:24:51.806Z",
    updatedAt: "2025-03-30T10:24:51.806Z",
  },
  {
    _id: "67eb16337db753f356e1176f",
    firstname: "Tigist",
    lastname: "Mengistu",
    email: "tigist@gmail.com",
    age: 38,
    gender: "female",
    phoneNumber: "251922334455",
    specializations: ["Dermatology"],
    qualifications: ["MD", "PhD"],
    licenses: [
      {
        url: "https://example.com/license2.pdf",
        type: "pdf",
        isVerified: false,
        _id: "67eb16337db753f356e1177f",
      },
    ],
    hospital: {
      address: {
        street: "Megenagna",
        city: "Addis Ababa",
        region: "Addis Ababa",
        country: "Ethiopia",
        postalCode: "1000",
      },
      _id: "67e83e148439394e7ff2ee54",
      name: "Yekatit 12 Hospital",
      branch: 1,
    },
    banned: true,
    status: "pending",
    createdAt: "2025-03-29T15:30:51.806Z",
    updatedAt: "2025-03-29T15:30:51.806Z",
  },
]

const BannedDoctors = () => {
  const ITEMS_PER_PAGE = 3
  const [currentPage, setCurrentPage] = useState(1)
  const [bannedDoctors, setBannedDoctors] = useState<Doctor[]>([])

  useEffect(() => {
    // In a real application, you would fetch data from an API
    // For now, we'll filter the mock data to only show banned doctors
    const filtered = mockDoctors.filter((doctor) => doctor.banned)
    setBannedDoctors(filtered)
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const paginatedData = bannedDoctors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "long",
    })
  }

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="container mx-auto p-6">

      <div className="space-y-4">
        {paginatedData.map((doctor) => (
          <Card key={doctor._id} className="overflow-hidden border-red-200 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="bg-red-50 p-4 border-b border-red-100">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-red-200">
                    <AvatarFallback className="bg-red-100 text-red-700">
                      {getInitials(doctor.firstname, doctor.lastname)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Dr. {doctor.firstname} {doctor.lastname}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {doctor.specializations.map((specialization, index) => (
                        <Badge key={index} variant="outline" className="bg-white text-red-600 border-red-200">
                          {specialization}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Hospital className="h-4 w-4 text-gray-400" />
                  <span>{doctor.hospital.name}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{doctor.phoneNumber}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{doctor.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Banned on: {formatDate(doctor.updatedAt)}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-gray-50 border-t p-4 flex justify-end">
              <Button variant="destructive" className="bg-red-500 hover:bg-red-600">
                Restore Access
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {bannedDoctors.length > ITEMS_PER_PAGE && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: Math.ceil(bannedDoctors.length / ITEMS_PER_PAGE) }).map((_, pageIndex) => (
                <PaginationItem key={pageIndex}>
                  <PaginationLink
                    isActive={currentPage === pageIndex + 1}
                    onClick={() => handlePageChange(pageIndex + 1)}
                    className="cursor-pointer"
                  >
                    {pageIndex + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < Math.ceil(bannedDoctors.length / ITEMS_PER_PAGE) && handlePageChange(currentPage + 1)
                  }
                  className={
                    currentPage >= Math.ceil(bannedDoctors.length / ITEMS_PER_PAGE)
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

export default BannedDoctors

