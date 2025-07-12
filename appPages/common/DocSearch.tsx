"use client"
import { useEffect, useState } from "react"
import { Check, Loader2, MapPin, Phone, Star, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { DoctorModel } from "@/components/models/doctor"
import type { PatientModel } from "@/components/models/patient"
import { useGetVerifiedDoctorsQuery } from "@/redux/api/doctorApi"
import { useGetVisitsByDoctorIdPatientIdQuery } from "@/redux/api/patientApi"
import { useSessionUser } from "@/components/context/Session"
import { RequestVisitModal } from "@/components/patient-components/modals/RequestVisit"

interface DoctorProfileProps {
  doctorID: string
}

export default function DoctorProfile({ doctorID }: DoctorProfileProps) {
  const { user }: { user?: PatientModel } = useSessionUser()
  const [doctor, setDoctor] = useState<DoctorModel>()
  const [openRequestVisit, setOpenRequestVisit] = useState(false)

  const { data, status, error, isLoading } = useGetVerifiedDoctorsQuery()
  const { data: visitData, status: statusData } = useGetVisitsByDoctorIdPatientIdQuery({
    doctor_id: doctorID,
    patient_id: user?._id ?? "",
  })

  console.log("this is the visit data", visitData)
  const visits = visitData?.data?.visits ?? []

  useEffect(() => {
    const doctors: DoctorModel[] = data?.data?.doctors ?? []
    const doctor = doctors.find((d) => d._id == doctorID)
    if (doctor) setDoctor(doctor)
  }, [data?.data?.doctors, doctorID])

  const renderStatusBadge = (approval: "Approved" | "Denied" | "Scheduled") => {
    const variants = {
      Scheduled: "warning",
      Approved: "success",
      Denied: "destructive",
    } as const

    return <Badge>{approval}</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Something went wrong</p>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto py-8">
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6">
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <Avatar className="h-24 w-24 border-4 border-white">
                  <AvatarFallback className="text-xl font-bold bg-teal-500 text-white">
                    {doctor.firstname} {doctor.lastname}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white">
                    Dr. {doctor.firstname} {doctor.lastname?.at(0)?.toUpperCase()}
                  </h2>
                  <p className="text-teal-100">{doctor.email}</p>
                  <div className="mt-2 flex items-center justify-center gap-1 md:justify-start">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round((doctor.rating ?? 0)) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-white">{(doctor.rating ?? 0).toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-sm">
                <Check className="h-5 w-5 text-white" />
                <span>License Verified</span>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                  <p className="text-lg">
                    {doctor.firstname} {doctor.lastname}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                  <p className="flex items-center gap-2 text-lg">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {doctor.phoneNumber}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
                  <p className="flex items-center gap-2 text-lg">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {doctor.gender}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Age</h3>
                  <p className="text-lg">{doctor.age} years</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Specialization</h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {doctor.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline" className="bg-teal-50">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Qualification</h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {doctor.qualifications.map((qual, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50">
                        {qual}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                  <p className="flex items-center gap-2 text-lg">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Addis Ababa, Bole
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          <CardContent className="flex flex-col items-center justify-between gap-4 p-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${
                      star <= Math.round((doctor.rating ?? 0)) ? "fill-yellow-400 text-yellow-400" : "text-white/40"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">{(doctor.rating ?? 0).toFixed(1)}</span>
            </div>

            <Separator className="h-8 w-px bg-white/20 md:block" />

            {visits.length > 0 ? (
              <div className="text-lg font-medium bg-gradient-to-r from-orange-300 to-orange-600 text-white px-4 py-2 rounded-full">
                You currently have an active visit scheduled with the doctor.
              </div>
            ) : (
              <Button onClick={() => setOpenRequestVisit(true)} className="bg-white text-teal-600 hover:bg-white/90">
                Request Visit
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <RequestVisitModal open={openRequestVisit} setOpen={setOpenRequestVisit} doctor={doctor ?? ({} as DoctorModel)} />
    </>
  )
}
