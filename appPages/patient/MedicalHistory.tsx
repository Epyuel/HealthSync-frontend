"use client"

import { useState, useEffect } from "react"
import { Calendar, FileText, Filter, Loader2, Phone, Search, SortDesc, User, Activity } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSessionUser } from "@/components/context/Session"
import { useGetVisitsByPatientIdQuery } from "@/redux/api/patientApi"
import type { VisitModel } from "@/components/models/visitModel"
import { ViewVisit } from "@/components/doctor-components/modals/viewVisit"
import type { VisitCard } from "../doctor/ActiveVisits"
import dayjs from "dayjs"

const ITEMS_PER_PAGE = 7

interface HistoryEntry {
  id: string
  date: string
  doctor: string
  diagnosis: string
  contact: string
  severity?: "low" | "medium" | "high"
}

const PatientMedicalHistory = () => {
  const { user } = useSessionUser()
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredData, setFilteredData] = useState<HistoryEntry[]>([])
  const [completedVisits, setCompletedVisits] = useState<HistoryEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const [openViewVisit, setOpenViewVisit] = useState(false)
  const [selectedCard, setSelectedCard] = useState<VisitCard>({} as VisitCard)
  

  // Fetch visits data
  const {
    data: visitsData,
    isLoading,
    isError,
  } = useGetVisitsByPatientIdQuery({
    id: user?._id ?? "",
  })



  // Determine severity based on diagnosis
  const getSeverity = (diagnosis: string): "low" | "medium" | "high" => {
    const lowTerms = ["routine", "check", "minor", "normal", "healthy"]
    const highTerms = ["emergency", "severe", "critical", "urgent", "surgery"]

    diagnosis = diagnosis.toLowerCase()

    if (highTerms.some((term) => diagnosis.includes(term))) return "high"
    if (lowTerms.some((term) => diagnosis.includes(term))) return "low"
    return "medium"
  }

  useEffect(() => {
    console.log("visits data", visitsData);
    if (visitsData?.data?.visits) {
      const processed = visitsData.data.visits
        .filter((visit: VisitModel) => visit.status === 'Completed')
        .map((visit: VisitModel) => {
          return {
            id: visit._id,
            date: dayjs(visit.endDate).format('DD/MM/YY'),
            patient: user ? `${user.firstname} ${user.lastname}` : 'Unknown user',
            diagnosis: visit.diagnosis || 'No diagnosis provided',
            contact: user?.phoneNumber || 'No contact info',
          };
        });
      setCompletedVisits(processed);
      setFilteredData(processed);
    }
  }, [visitsData, user]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(completedVisits)
    } else {
      const filtered = completedVisits.filter(
        (entry) =>
          entry.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.doctor?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredData(filtered)
    }
  }, [searchTerm, completedVisits])

  // Handle sort
  useEffect(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const dateA = dayjs(a.date, "DD MMM YYYY")
      const dateB = dayjs(b.date, "DD MMM YYYY")

      return sortOrder === "newest" ? dateB.valueOf() - dateA.valueOf() : dateA.valueOf() - dateB.valueOf()
    })

    setFilteredData(sorted)
  }, [sortOrder])

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getSeverityBadge = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Routine
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Standard
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Critical
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-xl font-semibold">My Medical History</CardTitle>
            </div>
            <CardDescription className="mt-1">View your past medical visits and diagnoses</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search diagnoses..."
                className="pl-9 w-full sm:w-[200px] h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full sm:w-[160px] h-9">
                <div className="flex items-center gap-2">
                  <SortDesc className="h-4 w-4 text-slate-500" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="text-sm text-slate-500">Loading your medical records...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-500">
            <FileText className="h-12 w-12 mb-2 text-red-400" />
            <p className="font-medium">Error loading your medical history</p>
            <p className="text-sm text-slate-500 mt-1">Please try again later</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <FileText className="h-12 w-12 mb-2 text-slate-300" />
            <p className="font-medium text-slate-700">No medical records found</p>
            <p className="text-sm text-slate-500 mt-1">Your completed visits will appear here</p>
          </div>
        ) : (
          <>
            <Table className="table-fixed min-w-[600px] w-full">
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="w-1/4 px-2 sm:px-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 justify-center">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span>Visit Date</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-1/4 px-2 sm:px-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 justify-center">
                      <Filter className="h-4 w-4 text-slate-500" />
                      <span>Diagnosis</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-1/4 px-2 sm:px-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 justify-center">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span>Contact</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-1/4 px-2 sm:px-4 text-xs sm:text-sm text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-slate-50">
                    <TableCell className="w-1/4 font-medium px-2 sm:px-4 text-xs sm:text-sm text-center">{entry.date}</TableCell>
                    <TableCell className="w-1/4 px-2 sm:px-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-700">{entry.diagnosis}</span>
                        {getSeverityBadge(entry.severity || "medium")}
                      </div>
                    </TableCell>
                    <TableCell className="w-1/4 px-2 sm:px-4 text-xs sm:text-sm text-center">{entry.contact}</TableCell>
                    <TableCell className="w-1/4 px-2 sm:px-4 text-xs sm:text-sm text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                        onClick={() => {
                          setOpenViewVisit(true)
                          setSelectedCard(
                            visitsData?.data?.visits.find((visit: VisitModel) => visit._id === entry.id) as VisitCard,
                          )
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-medium">
                  {Math.min(filteredData.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}
                </span>{" "}
                to <span className="font-medium">{Math.min(filteredData.length, currentPage * ITEMS_PER_PAGE)}</span> of{" "}
                <span className="font-medium">{filteredData.length}</span> records
              </p>

              <Pagination>
                <PaginationContent>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink onClick={() => handlePageChange(i + 1)} isActive={currentPage === i + 1}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </CardContent>

      <ViewVisit open={openViewVisit} setOpen={setOpenViewVisit} visit={selectedCard} />
    </Card>
  )
}

export default PatientMedicalHistory
