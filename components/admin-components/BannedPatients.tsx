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
import { useGetAllPatientsQuery } from "@/redux/api/adminApi"
import { FaBan } from "react-icons/fa";

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


const BannedPatients = () => {
  const ITEMS_PER_PAGE = 3
  const [currentPage, setCurrentPage] = useState(1)
  const [bannedPatients, setBannedPatients] = useState<Patient[]>([])

  const { data: allfetchedPatients, isLoading, isError } = useGetAllPatientsQuery({ page: 1, limit: 1000 })

  useEffect(() => {
    if (allfetchedPatients) {
      const filtered = allfetchedPatients?.data?.patients.filter((patient: Patient) => patient.banned)
      setBannedPatients(filtered)
    }
  }, [allfetchedPatients])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const paginatedData = bannedPatients.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="container mx-auto p-6">
      {bannedPatients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-purple-50 flex items-center justify-center">
            <FaBan className="text-purple-500" size={40}/>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Banned Patients Found</h3>
          <p className="text-gray-600 max-w-md">
            There are currently no patients with banned status in the system. All patients have active access.
          </p>
        </div>
      ) : (
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
      )}

      {bannedPatients.length > 0 && bannedPatients.length > ITEMS_PER_PAGE && (
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
