import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, User, FileText, Pill, FlaskConical, AlertCircle } from "lucide-react"
import { useGetUpcomingActiveAppointmentsQuery } from "@/redux/api/patientApi"
import { useGetDoctorByIdQuery, useUpdateVisitMutation } from "@/redux/api/doctorApi"
import imgg from "@/public/images/doctor.png"
import { useSessionUser } from "@/components/context/Session"
import { PatientModel } from "../models/patient"
import { message } from "antd"
import { VisitModel } from "../models/visitModel"
import { useState } from "react"

const Appointment = () => {
  const { user }: { user?: PatientModel } = useSessionUser()
  const patientId = user?._id

  // Fetch upcoming visits
  const {
    data: visits,
    isLoading: isLoadingAppointments,
    isError: isAppointmentsError,
  } = useGetUpcomingActiveAppointmentsQuery(patientId || "")

  // Get the most recent approved appointment
  const sortedVisits = visits?.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const appointment = sortedVisits?.[0]

  // Fetch doctor details if appointment exists
  const {
    data: doctorResponse,
    isLoading: isLoadingDoctor,
    isError: isDoctorError,
  } = useGetDoctorByIdQuery(appointment?.doctor || "", {
    skip: !appointment?.doctor,
  })

  // Extract the nested doctor data
  const doctor = doctorResponse?.data

  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateInput: string | Date) => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const [updateVisit] = useUpdateVisitMutation()
  const [isCancelling, setIsCancelling] = useState(false)

  const handleCancelAppointment = async () => {
    if (!appointment?._id) return

    setIsCancelling(true)
    const visitData: VisitModel = {
      status: 'Cancelled',
      approval: appointment.approval,
      reason: appointment.reason,
      labResults: appointment.labResults,
      prescription: appointment.prescription,
      startDate: appointment.startDate,
      endDate: appointment.endDate,    
      patient: appointment.patient,
      doctor: appointment.doctor,
      preferredDate: appointment.preferredDate,
  } as VisitModel;


    try {
      await updateVisit({ visitID: appointment._id, body: visitData }).unwrap()
      message.success("Your appointment has been successfully cancelled.")
    } catch (error) {
      message.error("Failed to cancel the appointment. Please try again.")
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoadingAppointments) {
    return (
      <div className="container mx-auto basis-2/5 space-y-5">
        <h1 className="font-bold text-xl text-start text-gray-800">Your Upcoming Visit</h1>
        <Card className="shadow-lg rounded-2xl bg-white border-0">
          <div className="animate-pulse p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-200 rounded w-40"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (isAppointmentsError || !visits?.length) {
    return (
      <div className="container mx-auto basis-2/5 space-y-5">
        <h1 className="font-bold text-xl text-start text-gray-800">Upcoming Visits</h1>
        <Card className="rounded-2xl bg-white border-0">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No upcoming Visits</h3>
                <p className="text-gray-500 mt-1">Schedule your next Visit with your Doctor</p>
              </div>
              {/* <Button className="mt-4">Schedule Visit</Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto basis-2/5 space-y-5">
      <h1 className="font-bold text-xl text-start text-gray-800">Upcoming Visits</h1>
      <Card className="shadow-lg rounded-2xl bg-white border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 ring-4 ring-white shadow-lg">
              <AvatarImage
                src={"/placeholder.svg"}
                alt={doctor?.firstname ? `Dr. ${doctor.firstname}` : "Doctor"}
              />
              <AvatarFallback className="bg-gradient-to-r from-blue-300 to-indigo-300 text-white text-lg font-semibold">
                {doctor?.firstname && doctor?.lastname
                  ? `${doctor.firstname[0]}${doctor.lastname[0]}`.toUpperCase()
                  : "DR"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {isLoadingDoctor
                  ? "Loading..."
                  : `Dr. ${doctor?.firstname || ""} ${doctor?.lastname || ""}`.trim() || "Doctor"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isLoadingDoctor ? "Loading..." : doctor?.specializations?.join(", ") || "Specialist"}
              </p>
              {isDoctorError && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Could not load doctor details
                </p>
              )}
            </div>
            <Badge className={`${getStatusColor(appointment?.status || "")} font-medium`}>
              {appointment?.status || "N/A"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Date and Time Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold text-gray-900">
                  {appointment ? formatDate(appointment.preferredDate) : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold text-gray-900">
                  {appointment ? `${formatTime(appointment.startDate)} - ${formatTime(appointment.endDate)}` : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Appointment Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Reason for Visit</p>
                <p className="font-medium text-gray-900">{appointment?.reason || "Not specified"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              disabled={!appointment || isCancelling}
              onClick={handleCancelAppointment}
            >
              {isCancelling ? (
                <span className="flex items-center gap-2">
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Cancelling...
                </span>
              ) : (
                "Cancel Appointment"
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-500 text-center bg-gray-50 p-2 rounded-lg mt-2">
            You can cancel your visit request only before the doctor approves or denies it.
          </p>

          {/* Appointment ID */}
          {appointment?._id && (
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500 text-center">
                Appointment ID: {appointment._id.slice(-8).toUpperCase()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Appointment
