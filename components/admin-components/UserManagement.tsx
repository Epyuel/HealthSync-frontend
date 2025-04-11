"use client"

import { useState, useEffect } from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useGetAllDoctorsQuery } from "@/redux/api/adminApi"
import { useGetAllPatientsQuery } from "@/redux/api/adminApi"

interface PatientResponse {
  bookmarks: any[]
  banned: boolean
  _id: string
  firstname: string
  lastname: string
  email: string
  age: number
  height: number
  weight: number
  blood: string
  gender: string
  phoneNumber: string
  medicalConditions: string[]
  pastTreatments: string[]
  majorAccidents: string[]
  allergies: string[]
  __v: number
  createdAt: string
  nationality?: string
}

interface DoctorResponse {
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
  licenses: {
    url: string
    type: string
    isVerified: boolean
    _id: string
  }[]
  hospital: {
    address: {
      street: string
      city: string
      region: string
      country: string
      postalCode: string
    }
    _id: string
    name: string
    branch: number
    __v: number
  }
  createdAt: string
  updatedAt: string
  __v: number
}

type User = (PatientResponse | DoctorResponse) & {
  fullname: string
  role?: string
  banned?: boolean
  createdAt?: string
  email: string
  phoneNumber: string
  _id: string
  status?: string
  age: number
  gender: string
  specializations?: string[]
  qualifications?: string[]
  licenses?: {
    url: string
    type: string
    isVerified: boolean
    _id: string
  }[]
  hospital?: {
    address: {
      street: string
      city: string
      region: string
      country: string
      postalCode: string
    }
    _id: string
    name: string
    branch: number
    __v: number
  }
  height?: number
  weight?: number
  blood?: string
  medicalConditions?: string[]
  pastTreatments?: string[]
  majorAccidents?: string[]
  allergies?: string[]
  nationality?: string
}

const mergeUsersData = (patients: PatientResponse[], doctors: DoctorResponse[]): User[] => {
  const patientsWithRole = patients?.map((patient) => ({
    ...patient,
    role: "patient",
    fullname: `${patient.firstname} ${patient.lastname}`,
  }))

  const doctorsWithRole = doctors?.map((doctor) => ({
    ...doctor,
    role: "doctor",
    fullname: `${doctor.firstname} ${doctor.lastname}`,
  }))

  return [...(patientsWithRole || []), ...(doctorsWithRole || [])]
}

const filterByDate = (joined: string | undefined, filter: string): boolean => {
  if (!joined) return true

  const userDate = new Date(joined)
  const today = new Date()

  switch (filter) {
    case "week":
      const lastWeek = new Date()
      lastWeek.setDate(today.getDate() - 7)
      return userDate >= lastWeek
    case "month":
      const lastMonth = new Date()
      lastMonth.setMonth(today.getMonth() - 1)
      return userDate >= lastMonth
    case "4months":
      const last4Months = new Date()
      last4Months.setMonth(today.getMonth() - 4)
      return userDate >= last4Months
    case "year":
      const lastYear = new Date()
      lastYear.setFullYear(today.getFullYear() - 1)
      return userDate >= lastYear
    default:
      return true
  }
}

const UserManagement = () => {
  const { data: getAllPatientsQuery, isLoading: isPatientsLoading } = useGetAllPatientsQuery({ page: 1, limit: 1000 })
  const { data: getAllDoctorsQuery, isLoading: isDoctorsLoading } = useGetAllDoctorsQuery({ page: 1, limit: 1000 })

  // console.log("patients bbom", getAllPatientsQuery?.data?.patients)
  // console.log("doctors boom", getAllDoctorsQuery?.data?.doctors)

  // const sampleData = {
  //   patients: getAllPatientsQuery?.data?.patients || [],
  //   doctors: getAllDoctorsQuery?.data?.doctors || [],
  // }

  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)
  const [selectedLicense, setSelectedLicense] = useState("")
  const [banDialogOpen, setBanDialogOpen] = useState(false)
  const itemsPerPage = 6
  const isLoading = isPatientsLoading || isDoctorsLoading

  useEffect(() => {
    const mergedUsers = mergeUsersData(getAllPatientsQuery?.data?.patients, getAllDoctorsQuery?.data?.doctors)
    setUsers(mergedUsers)
  }, [getAllPatientsQuery, getAllDoctorsQuery])

  const filteredUsers = users.filter(
    (user) =>
      (roleFilter !== "all" ? user.role === roleFilter : true) &&
      (search ? user.fullname.toLowerCase().includes(search.toLowerCase()) : true) &&
      filterByDate(user.createdAt, dateFilter),
  ) as User[]

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleBanUser = (): void => {
    if (selectedUser) {
      const updatedUsers = users?.map((user) =>
        user._id === selectedUser._id ? { ...user, banned: !user.banned } : user,
      )
      setUsers(updatedUsers)
      setSelectedUser({ ...selectedUser, banned: !selectedUser.banned })
      setBanDialogOpen(false)
    }
  }

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch (error) {
      return "Invalid Date"
    }
  }

  const openPdfViewer = (url: string): void => {
    setSelectedLicense(url)
    setPdfDialogOpen(true)
  }

  return (
    <div className="mt-10 p-4 w-full">
      <div className="flex flex-wrap gap-4 mb-4">
        <Select
          value={roleFilter}
          onValueChange={(value) => {
            setRoleFilter(value)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="patient">Patient</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={dateFilter}
          onValueChange={(value) => {
            setDateFilter(value)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="4months">Last 4 Months</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
          className="w-[250px]"
        />
      </div>

      <div className="">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell>
                    <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-28 bg-gray-200 animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedUsers.length > 0 ? (
              paginatedUsers?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.fullname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="capitalize">
                      {user.role === "doctor" ? "Doctor" : "Patient"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.banned ? "destructive" : "outline"}>{user.banned ? "Banned" : "Active"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="bg-secondaryColor text-white"
                      onClick={() => setSelectedUser(user)}
                    >
                      More
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {!isLoading && totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog
          open={!!selectedUser}
          onOpenChange={(open) => {
            if (!open) setSelectedUser(null)
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedUser.fullname}
                <Badge variant={selectedUser.role === "doctor" ? "default" : "default"}>
                  {selectedUser.role === "doctor" ? "Doctor" : "Patient"}
                </Badge>
                {selectedUser.banned && <Badge variant="destructive">Banned</Badge>}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              <p>
                <span className="font-bold">Email</span>: {selectedUser.email}
              </p>
              <p>
                <span className="font-bold">Phone</span>: {selectedUser.phoneNumber}
              </p>
              <p>
                <span className="font-bold">Gender</span>: {selectedUser.gender}
              </p>
              <p>
                <span className="font-bold">Age</span>: {selectedUser.age}
              </p>
              <p>
                <span className="font-bold">Joined</span>: {formatDate(selectedUser.createdAt)}
              </p>

              {selectedUser.role === "doctor" && (
                <>
                  <p>
                    <span className="font-bold">Specializations</span>:{" "}
                    {selectedUser.specializations?.join(", ") || "None"}
                  </p>
                  <p>
                    <span className="font-bold">Qualifications</span>:{" "}
                    {selectedUser.qualifications?.join(", ") || "None"}
                  </p>
                  <p>
                    <span className="font-bold">Status</span>: {selectedUser.status}
                  </p>

                  {selectedUser.hospital && (
                    <div className="mt-2">
                      <p className="font-bold">Hospital Information:</p>
                      <p className="ml-4">Name: {selectedUser.hospital.name}</p>
                      <p className="ml-4">Branch: {selectedUser.hospital.branch}</p>
                      {selectedUser.hospital.address && (
                        <div className="ml-4">
                          <p>
                            Address: {selectedUser.hospital.address.street}, {selectedUser.hospital.address.city}
                          </p>
                          <p>
                            {selectedUser.hospital.address.region}, {selectedUser.hospital.address.country}{" "}
                            {selectedUser.hospital.address.postalCode}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedUser.licenses && selectedUser.licenses.length > 0 && (
                    <div className="mt-2">
                      <p className="font-bold">Licenses:</p>
                      {selectedUser.licenses?.map((license, index) => (
                        <div key={license._id || index} className="ml-4 flex items-center gap-2">
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-500"
                            onClick={() => openPdfViewer(license.url)}
                          >
                            View License
                          </Button>
                          <Badge variant={license.isVerified ? "default" : "outline"}>
                            {license.isVerified ? "Verified" : "Not Verified"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {selectedUser.role === "patient" && (
                <>
                  <p>
                    <span className="font-bold">Height</span>: {selectedUser.height} cm
                  </p>
                  <p>
                    <span className="font-bold">Weight</span>: {selectedUser.weight} kg
                  </p>
                  <p>
                    <span className="font-bold">Blood Type</span>: {selectedUser.blood}
                  </p>
                  {selectedUser.nationality && (
                    <p>
                      <span className="font-bold">Nationality</span>: {selectedUser.nationality}
                    </p>
                  )}

                  {selectedUser.medicalConditions && selectedUser.medicalConditions.length > 0 && (
                    <div className="mt-2">
                      <p className="font-bold">Medical Conditions:</p>
                      <ul className="list-disc ml-6">
                        {selectedUser.medicalConditions?.map((condition, index) => (
                          <li key={index}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedUser.pastTreatments && selectedUser.pastTreatments.length > 0 && (
                    <div className="mt-2">
                      <p className="font-bold">Past Treatments:</p>
                      <ul className="list-disc ml-6">
                        {selectedUser.pastTreatments?.map((treatment, index) => (
                          <li key={index}>{treatment}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedUser.majorAccidents && selectedUser.majorAccidents.length > 0 && (
                    <div className="mt-2">
                      <p className="font-bold">Major Accidents:</p>
                      <ul className="list-disc ml-6">
                        {selectedUser.majorAccidents?.map((accident, index) => (
                          <li key={index}>{accident}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedUser.allergies && selectedUser.allergies.length > 0 && (
                    <div className="mt-2">
                      <p className="font-bold">Allergies:</p>
                      <ul className="list-disc ml-6">
                        {selectedUser.allergies?.map((allergy, index) => (
                          <li key={index}>{allergy}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="destructive" onClick={() => setBanDialogOpen(true)}>
                {selectedUser.banned ? "Unban User" : "Ban User"}
              </Button>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {pdfDialogOpen && (
        <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>License Document</DialogTitle>
            </DialogHeader>
            <div className="h-full w-full">
              <iframe src={selectedLicense} className="w-full h-[60vh]" title="License PDF" />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedUser?.banned ? "Unban User" : "Ban User"}</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.banned
                ? "Are you sure you want to unban this user? They will regain access to the platform."
                : "Are you sure you want to ban this user? They will lose access to the platform."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBanUser}>{selectedUser?.banned ? "Unban" : "Ban"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default UserManagement
