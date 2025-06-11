"use client"

import Image from "next/image"
import type React from "react"
import { useState } from "react"
import {
  Stethoscope,
  Pill,
  Calendar,
  FileText,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  // ExternalLink,
} from "lucide-react"
import { HiOutlineDocumentText } from "react-icons/hi"
import { useGetOnlyScheduledVisitsQuery } from "@/redux/api/patientApi"
import { useSessionUser } from "@/components/context/Session"
import type { PatientModel } from "@/components/models/patient"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import Link from "next/link"


const DiagnosisComponent: React.FC = () => {
  const { user }: { user?: PatientModel } = useSessionUser()
  const patientId = user?._id
  const { data: visitData, isLoading, isError } = useGetOnlyScheduledVisitsQuery(patientId || "")
  const [activeVisitIndex, setActiveVisitIndex] = useState(0)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">f
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (isError || !visitData?.data?.visits || visitData.data.visits.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Visit Records Found</h2>
        <p className="text-gray-500">You don&apos;t have any visit records at the moment.</p>
      </div>
    )
  }

  const visits = visitData.data.visits
  const activeVisit = visits[activeVisitIndex]

  const handlePrevVisit = () => {
    setActiveVisitIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNextVisit = () => {
    setActiveVisitIndex((prev) => (prev < visits.length - 1 ? prev + 1 : prev))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateInput: string | Date) => {
    try {
      const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
      return format(date, "MMM dd, yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      {/* Visit Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevVisit}
          disabled={activeVisitIndex === 0}
          className={`p-2 rounded-full ${activeVisitIndex === 0 ? "text-gray-300" : "text-blue-600 hover:bg-blue-50"}`}
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Visit Record</h2>
          <p className="text-sm text-gray-500">
            {activeVisitIndex + 1} of {visits.length}
          </p>
        </div>
        <button
          onClick={handleNextVisit}
          disabled={activeVisitIndex === visits.length - 1}
          className={`p-2 rounded-full ${activeVisitIndex === visits.length - 1 ? "text-gray-300" : "text-blue-600 hover:bg-blue-50"}`}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Visit Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b">
        <div className="flex flex-col mb-4 sm:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-gray-500" size={20} />
            <span className="text-sm text-gray-600">
              {activeVisit.startDate ? formatDate(activeVisit.startDate) : formatDate(activeVisit.preferredDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="text-gray-500" size={20} />
            <span className="text-sm text-gray-600">ID: {activeVisit._id.substring(0, 8)}</span>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-lg ${getStatusColor(activeVisit.status)}`}>
          <span className="text-sm font-semibold">{activeVisit.status}</span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger data-testid="overview-tabs" value="overview">Overview</TabsTrigger>
          <TabsTrigger data-testid="prescription-tabs" value="prescription">Prescription</TabsTrigger>
          <TabsTrigger data-testid="labResults-tabs" value="labResults">Lab Results</TabsTrigger>
        </TabsList>

        <TabsContent data-testid="overview-tabs-content" value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visit Details</CardTitle>
              <CardDescription>Information about your medical visit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Reason for Visit</h3>
                  <p className="text-gray-800">{activeVisit.reason}</p>
                </div>

                {activeVisit.diagnosis && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="text-gray-500" size={18} />
                      <h3 className="text-sm font-medium text-gray-500">Diagnosis</h3>
                    </div>
                    <p className="text-gray-800">{activeVisit.diagnosis}</p>
                  </div>
                )}
              </div>

              {activeVisit.notes && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <ClipboardList className="text-gray-500" size={18} />
                    <h3 className="text-sm font-medium text-gray-500">Doctor&apos;s Notes</h3>
                  </div>
                  <p className="text-gray-800 whitespace-pre-line">{activeVisit.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent data-testid="prescription-tabs-content" value="prescription" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="text-gray-500" size={20} />
                <span>Prescription</span>
              </CardTitle>
              <CardDescription>Medications prescribed during your visit</CardDescription>
            </CardHeader>
            <CardContent>
              {(activeVisit?.prescription ?? []).length > 0 ? (
                <div className="space-y-6">
                  {(activeVisit.prescription ?? []).map((med: any) => (
                    <div key={med._id} className="border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">{med.medication}</h3>
                        <Badge variant="outline">{med.dosage}</Badge>
                      </div>
                      <div className="text-gray-700 whitespace-pre-line">{med.instructions}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">No information available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent data-testid="labResults-tabs-content" value="labResults" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HiOutlineDocumentText size={20} className="text-gray-500" />
                <span>Lab Results</span>
              </CardTitle>
              <CardDescription>Test results from your medical visit</CardDescription>
            </CardHeader>
            <CardContent>
              {(activeVisit.labResults?.length ?? 0) > 0 ? (
                <div className="space-y-6">
                  {activeVisit.labResults?.map((lab: any) => (
                    <div key={lab._id} className="border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">{lab.testName}</h3>
                        {lab.normalRange && (
                          <div className="text-sm text-gray-500">
                            Normal Range: {lab.normalRange} {lab.unit}
                          </div>
                        )}
                      </div>

                      {lab.result && lab.result.startsWith("http") ? (
                        <div className="mt-2">
                          {/* <Link
                            href={lab.result}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink size={16} />
                            <span>View Result Image</span>
                          </Link> */}
                          <div className="mt-3 max-w-md mx-auto">
                            <Image
                              src={lab.result || "/placeholder.svg"}
                              alt={`${lab.testName} result`}
                              width={400}
                              height={300}
                              className="rounded-md border shadow-sm"
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700">{lab.result}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">No lab results available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DiagnosisComponent
