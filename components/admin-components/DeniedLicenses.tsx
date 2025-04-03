"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Ban, AlertCircle} from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Address {
  street: string
  city: string
  region: string
  country: string
  postalCode: string
}

interface Hospital {
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
  bookmarks: any[]
  status: string
  banned: boolean
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
  hospital: Hospital
  createdAt: string
  updatedAt: string
  __v: number
}

interface DoctorsResponse {
  doctors: Doctor[]
}

const ITEMS_PER_PAGE = 6

const DeniedLicenses = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentLicenseUrl, setCurrentLicenseUrl] = useState("")

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const mockResponse: DoctorsResponse = {
          doctors: [
            {
              bookmarks: [],
              status: "pending",
              banned: false,
              _id: "67eb15297db753f356e1173e",
              firstname: "daniel",
              lastname: "teka",
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
              createdAt: "2025-03-31T22:20:25.702Z",
              updatedAt: "2025-03-31T22:20:25.702Z",
              __v: 0,
            },
            {
              bookmarks: [],
              status: "pending",
              banned: false,
              _id: "67eb16337db753f356e1174d",
              firstname: "melakeselam",
              lastname: "yitbarek",
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
              createdAt: "2025-03-31T22:24:51.806Z",
              updatedAt: "2025-03-31T22:24:51.806Z",
              __v: 0,
            },
          ],
        }

        const additionalDoctors = Array(10)
          .fill(0)
          .map((_, index) => ({
            ...mockResponse.doctors[index % 2],
            _id: `mock-id-${index}`,
            firstname: `Doctor${index}`,
            lastname: `Smith${index}`,
            email: `doctor${index}@example.com`,
            createdAt: new Date(Date.now() - index * 86400000).toISOString(), 
          }))

        const allDoctors = [...mockResponse.doctors, ...additionalDoctors]
        setDoctors(allDoctors)
        setTotalPages(Math.ceil(allDoctors.length / ITEMS_PER_PAGE))
      } catch (error) {
        console.error("Error fetching doctors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const paginatedDoctors = doctors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  const handleViewLicense = (url: string) => {
    setCurrentLicenseUrl(url)
    setIsDialogOpen(true)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading doctors data...</div>
  }

  return (
    <div className="pb-10 mt-10">

      <Card className="overflow-hidden border rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-medium">Name</TableHead>
                <TableHead className="font-medium">Age</TableHead>
                <TableHead className="font-medium">Phone</TableHead>
                <TableHead className="font-medium">Email</TableHead>
                <TableHead className="font-medium">Registration Date</TableHead>
                <TableHead className="font-medium">Specializations</TableHead>
                <TableHead className="font-medium">Hospital</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">License</TableHead>
                <TableHead className="font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDoctors.length > 0 ? (
                paginatedDoctors.map((doctor) => (
                  <TableRow key={doctor._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      Dr. {doctor.firstname.charAt(0).toUpperCase() + doctor.firstname.slice(1)}{" "}
                      {doctor.lastname.charAt(0).toUpperCase() + doctor.lastname.slice(1)}
                    </TableCell>
                    <TableCell>{doctor.age}</TableCell>
                    <TableCell>{doctor.phoneNumber}</TableCell>
                    <TableCell className="max-w-[150px] truncate" title={doctor.email}>
                      {doctor.email}
                    </TableCell>
                    <TableCell>{format(new Date(doctor.createdAt), "dd MMM yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {doctor.specializations.map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate" title={doctor.hospital.name}>
                      {doctor.hospital.name}
                    </TableCell>
                    <TableCell>{getStatusBadge(doctor.status)}</TableCell>
                    <TableCell>
                      {doctor.licenses.length > 0 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleViewLicense(doctor.licenses[0].url)}
                          title="View License"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => {}}
                        title="Reject License"
                      >
                        {/* <Ban className="w-4 h-4 mr-1" /> */}
                        Accept
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <AlertCircle className="w-8 h-8 mb-2" />
                      <p>No doctors found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {totalPages > 1 && (
        <Pagination className="mt-4 flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <PaginationItem key={pageIndex}>
                <PaginationLink
                  isActive={currentPage === pageIndex + 1}
                  onClick={() => handlePageChange(pageIndex + 1)}
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>License Document</DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full h-full min-h-0">
            {currentLicenseUrl && (
              <iframe src={currentLicenseUrl} className="w-full h-full border-0" title="License Document" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DeniedLicenses

