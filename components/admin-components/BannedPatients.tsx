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
import { Phone, Mail, Calendar, Droplets, Ruler, Weight, User } from "lucide-react"

// Define the types based on the API response
interface Patient {
  _id: string
  firstname: string
  lastname: string
  email: string
  age: number
  height: number
  weight: number
  nationality?: string
  blood: string
  gender: string
  phoneNumber: string
  medicalConditions: string[]
  pastTreatments: string[]
  majorAccidents: string[]
  allergies: string[]
  bookmarks: any[]
  banned: boolean
  createdAt?: string
  updatedAt?: string
  __v: number
}

// Sample data based on the API response structure
// In a real application, this would come from an API call
const mockPatients: Patient[] = [
  {
    _id: "67a0798ee48d2c496dffef6f",
    firstname: "Test",
    lastname: "Patient",
    email: "test@gmail.com",
    age: 33,
    height: 102,
    weight: 35,
    blood: "B+",
    gender: "male",
    phoneNumber: "251942512868",
    medicalConditions: [],
    pastTreatments: [],
    majorAccidents: [],
    allergies: [],
    bookmarks: [],
    banned: true,
    createdAt: "2025-03-15T10:27:14.156Z",
    updatedAt: "2025-03-15T10:27:14.156Z",
    __v: 0,
  },
  {
    _id: "67dd28bccccc9e8b5881d9d3",
    firstname: "Melakeselam",
    lastname: "Yitbarek",
    email: "melakeselamyitbarek2012@gmail.com",
    age: 23,
    height: 175,
    weight: 60,
    nationality: "Ethiopia",
    blood: "B+",
    gender: "male",
    phoneNumber: "251962212818",
    medicalConditions: ["Anxiety (ጭንቀት)"],
    pastTreatments: ["Surgery (ቀዶ ህክምና)"],
    majorAccidents: ["Sports Injury (የስፖርት ጉዳት)"],
    allergies: ["Peanuts (ኦቾሎኒ)"],
    bookmarks: [],
    banned: true,
    createdAt: "2025-03-20T11:24:49.939Z",
    updatedAt: "2025-03-20T11:24:49.939Z",
    __v: 0,
  },
  {
    _id: "67e2ae308d6953eb9314fad8",
    firstname: "Natnael",
    lastname: "Belay",
    email: "nati@gmail.com",
    age: 43,
    height: 178,
    weight: 77,
    nationality: "Ethiopia",
    blood: "AB-",
    gender: "male",
    phoneNumber: "251911121314",
    medicalConditions: ["Hypertension (ከፍተኛ የደም ግፊት)"],
    pastTreatments: ["Chemotherapy (ኪሚዮተራፒ)"],
    majorAccidents: ["Car Accident (የመኪና አደጋ)"],
    allergies: ["Peanuts (ኦቾሎኒ)"],
    bookmarks: [],
    banned: true,
    createdAt: "2025-03-25T10:27:14.156Z",
    updatedAt: "2025-03-25T10:27:14.156Z",
    __v: 0,
  },
  {
    _id: "67ed1892c173fca641a86488",
    firstname: "Yeabsra",
    lastname: "Aemro",
    email: "yeabsraaemro12@gmail.com",
    age: 24,
    height: 164,
    weight: 50,
    nationality: "Ethiopia",
    blood: "A+",
    gender: "female",
    phoneNumber: "251925291049",
    medicalConditions: ["Anxiety (ጭንቀት)"],
    pastTreatments: ["Chiropractic Treatment (የአካል ስርዓት ሕክምና)"],
    majorAccidents: ["Car Accident (የመኪና አደጋ)"],
    allergies: ["Milk (ወተት)"],
    bookmarks: [],
    banned: true,
    createdAt: "2025-04-01T10:59:30.861Z",
    updatedAt: "2025-04-01T10:59:30.861Z",
    __v: 0,
  },
]

const BannedPatients = () => {
  const ITEMS_PER_PAGE = 3
  const [currentPage, setCurrentPage] = useState(1)
  const [bannedPatients, setBannedPatients] = useState<Patient[]>([])

  useEffect(() => {
    // In a real application, you would fetch data from an API
    // For now, we'll filter the mock data to only show banned patients
    const filtered = mockPatients.filter((patient) => patient.banned)
    setBannedPatients(filtered)
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const paginatedData = bannedPatients.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // Format date to a more readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date"
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
        {paginatedData.map((patient) => (
          <Card key={patient._id} className="overflow-hidden border-purple-200 hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="bg-purple-50 p-4 border-b border-purple-100">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-purple-200">
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      {getInitials(patient.firstname, patient.lastname)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {patient.firstname} {patient.lastname}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <User className="h-4 w-4 text-purple-400" />
                      <span>
                        {patient.age} years, {patient.gender}
                      </span>
                      <Droplets className="h-4 w-4 ml-2 text-purple-400" />
                      <span>{patient.blood}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{patient.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{patient.phoneNumber}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Ruler className="h-4 w-4 text-gray-400" />
                  <span>Height: {patient.height} cm</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Weight className="h-4 w-4 text-gray-400" />
                  <span>Weight: {patient.weight} kg</span>
                </div>

                {patient.medicalConditions.length > 0 && (
                  <div className="col-span-1 md:col-span-2 mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Medical Conditions:</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.medicalConditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="bg-white text-purple-600 border-purple-200">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="col-span-1 md:col-span-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400 inline mr-2" />
                  <span>Banned on: {formatDate(patient.updatedAt)}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-gray-50 border-t p-4 flex justify-end">
              <Button variant="secondary" className="bg-purple-500 text-white hover:bg-purple-600">
                Restore Access
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {bannedPatients.length > ITEMS_PER_PAGE && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: Math.ceil(bannedPatients.length / ITEMS_PER_PAGE) }).map((_, pageIndex) => (
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
                    currentPage < Math.ceil(bannedPatients.length / ITEMS_PER_PAGE) && handlePageChange(currentPage + 1)
                  }
                  className={
                    currentPage >= Math.ceil(bannedPatients.length / ITEMS_PER_PAGE)
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

export default BannedPatients

