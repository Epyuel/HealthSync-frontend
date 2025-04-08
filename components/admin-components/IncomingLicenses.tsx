"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Eye, X } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const doctors = [
  {
    bookmarks: [],
    _id: "67eb15297db753f356e1173e",
    firstname: "daniel",
    lastname: "teka",
    email: "dani@gmail.com",
    age: 34,
    gender: "male",
    phoneNumber: "251987654321",
    specializations: ["Orthopedics"],
    qualifications: ["MCh", "MBBS"],
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
      __v: 0,
    },
    createdAt: "2025-03-31T22:20:25.702Z",
    updatedAt: "2025-03-31T22:20:25.702Z",
    __v: 0,
  },
]

const ITEMS_PER_PAGE = 2

const IncomingLicenses = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewPdf = (url: string) => {
    setSelectedPdf(url)
    setIsDialogOpen(true)
  }

  const handleDownloadPdf = async (url: string, filename = "license-document.pdf") => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()

      const blobUrl = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = blobUrl
      link.download = filename

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
    } catch (error) {
      console.error("Error downloading the file:", error)
    }
  }

  const paginatedDoctors = doctors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="py-10">
      {paginatedDoctors.map((doctor, index) => (
        <Card key={index} className="p-4 mb-4 border rounded-lg shadow-md bg-slate-100">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NAME</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{`${doctor.firstname} ${doctor.lastname}`}</TableCell>
                  <TableCell>{doctor.age}</TableCell>
                  <TableCell>{doctor.phoneNumber}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{formatDate(doctor.createdAt)}</TableCell>
                  <TableCell>{doctor.specializations.join(", ")}</TableCell>
                  <TableCell className="text-yellow-600">Pending Verification</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <CardContent className="mt-4 p-2 border rounded bg-gray-100">
            <h3 className="font-medium mb-2">License Documents</h3>
            {doctor.licenses.map((license, licenseIndex) => (
              <div key={licenseIndex} className="flex justify-between items-center bg-white p-2 my-2 rounded shadow">
                <span>License Document {licenseIndex + 1}</span>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => handleViewPdf(license.url)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDownloadPdf(license.url, `license-${doctor.lastname}-${licenseIndex + 1}.pdf`)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="flex justify-end gap-2 mt-4">
            <Button className="bg-green-500 text-white hover:bg-green-600">Accept</Button>
            <Button variant="destructive">Deny</Button>
          </div>
        </Card>
      ))}

      <Pagination className="mt-4">
        <PaginationPrevious
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          className={currentPage > 1 ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
          // disabled={currentPage <= 1}
        />
        <PaginationContent>
          {Array.from({ length: Math.ceil(doctors.length / ITEMS_PER_PAGE) }).map((_, pageIndex) => (
            <PaginationItem key={pageIndex}>
              <PaginationLink isActive={currentPage === pageIndex + 1} onClick={() => handlePageChange(pageIndex + 1)}>
                {pageIndex + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
        <PaginationNext
          onClick={() => currentPage < Math.ceil(doctors.length / ITEMS_PER_PAGE) && handlePageChange(currentPage + 1)}
          className={
            currentPage < Math.ceil(doctors.length / ITEMS_PER_PAGE)
              ? "cursor-pointer"
              : "cursor-not-allowed opacity-50"
          }
          // disabled={currentPage >= Math.ceil(doctors.length / ITEMS_PER_PAGE)}
        />
      </Pagination>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle>License Document</DialogTitle>
            </DialogHeader>
            <div className="flex-1 w-full h-full min-h-0">
              {selectedPdf && (
                <iframe src={`${selectedPdf}#toolbar=0&navpanes=0`} className="w-full h-full border-0" title="PDF Viewer" />
              )}
            </div>
          </DialogContent>
        </Dialog>
    </div>
  )
}

export default IncomingLicenses

