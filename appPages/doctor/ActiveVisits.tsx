"use client"

import type React from "react"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Phone, Edit2, XCircle, ClipboardList, CheckCircle } from "lucide-react"
import type { EmblaCarouselType } from "embla-carousel"
import Link from "next/link"
import { useGetAppointedPatientsQuery, useGetVisitsByDoctorIdApprovalQuery, useUpdateVisitMutation } from "@/redux/api/doctorApi"
import { DoctorModel } from "@/components/models/doctor"
import { useSessionUser } from "@/components/context/Session"
import { VisitModel } from "@/components/models/visitModel"
import dayjs from "dayjs"
import { EditVisitModal } from "@/components/doctor-components/modals/editVisit"
import { ViewVisit } from "@/components/doctor-components/modals/viewVisit"
import {message, Modal, Row, Spin} from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import { FaDropbox } from "react-icons/fa";
import { Typography } from "@mui/material"
import { PatientModel } from "@/components/models/patient"
import {useRouter} from "next/navigation"

export interface VisitCard extends VisitModel {
  name: string
  contact: string
  days: string
  image?: string
}

export const handleDaysCalculation = (date:Date)=>{
  const diff = dayjs(date).diff(dayjs().startOf('day'),'days');
  let days = '';
  if(diff>0){
    days = `In ${diff} day(s)`
  }else if(diff<0){
    days = `${Math.abs(diff)} days ago`
  }else if(diff==0){
    days = `Today - ${dayjs(date).format('hh:mm A')}`
  }
  return days
}

const ActiveVisits: React.FC = () => {
  const router = useRouter();
  const {user}:{user?: DoctorModel} = useSessionUser();
  const [scheduledVisits,setScheduledVisits] = useState<VisitCard[]>([]);
  const [completedVisits,setCompletedVisits] = useState<VisitCard[]>([]);
  const {data,isLoading,isError} = useGetVisitsByDoctorIdApprovalQuery({id:user?._id??'',approval:'Approved'});
  const {data:pData,isLoading: patientsIsLoading,isError: patientsIsError} = useGetAppointedPatientsQuery(user?._id??'');
  const [updateVisit] = useUpdateVisitMutation();
  const [openEditVisit,setOpenEditVisit] = useState(false);
  const [openViewVisit,setOpenViewVisit] = useState(false);
  const [selectedCard,setSelectedCard] = useState<VisitCard>({} as VisitCard);
  const [selectedPatient,setSelectedPatient] = useState<PatientModel>({} as PatientModel);
  const [patientsData,setPatientsData] = useState<PatientModel[]>([]);

  useEffect(()=>{
    setPatientsData(pData?.data??[]);
  },[pData?.data])

  useEffect(()=>{
    const v:VisitCard[] = []
    data?.data?.visits?.map((visit: VisitModel)=>{
      const days = handleDaysCalculation(visit.preferredDate);
      const appointedPatient = patientsData.find((d:any)=>d._id==visit.patient);

      v.push({
        _id: visit._id,
        name: appointedPatient?`${appointedPatient?.firstname} ${appointedPatient?.lastname}`:"Not specified",
        contact: appointedPatient?appointedPatient.phoneNumber:"Not specified",
        status: visit.status,
        preferredDate: visit.preferredDate,
        startDate: visit.startDate,
        endDate: visit.endDate,
        days,
        patient: visit.patient,
        doctor: visit.doctor,
        reason: visit.reason,
        approval: visit.approval,
        createdAt: visit.createdAt,
        prescription: visit.prescription,
        diagnosis:visit.diagnosis,
        labResults:visit.labResults,
        notes:visit.notes,
      })
    })

    setScheduledVisits(v.filter((visit) => visit.status === "Scheduled"))
    setCompletedVisits(
      v.filter((visit) => visit.status === "Completed").sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
    ) 
  },[data?.data?.visits, patientsData])

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: "auto",
    containScroll: "trimSnaps",
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 1 },
    },
  })
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  

  const getUrgencyColor = (days: string) => {
    if (days.includes("3 days") || days.includes("2 days") || days.includes("1 day")) {
      return "bg-rose-500"
    } else if (days.includes("5 days") || days.includes("4 days")) {
      return "bg-amber-500"
    } else {
      return "bg-emerald-500"
    }
  }

  const handleCompleteVisit = async ({name, contact,days, image,labResults,prescription,_id,createdAt,...visit}:VisitCard)=>{
    Modal.confirm({
      title: 'Are you sure?',
      // content: 'This action ',
      okText: 'Yes',
      // okType: 'danger',
      cancelText: 'Cancel',
      okButtonProps: {
        className: 'primary-button squared-button',
      },
      cancelButtonProps: {
        className: 'secondary-button squared-button',
      },
      onOk: async () => {
        try {
            const visitData = {...visit, status: 'Completed'}
            await updateVisit({visitID: _id,body: visitData}).unwrap();
            const formattedVisit:VisitCard = {
              ...visitData,
              _id:_id,
              name,
              contact,
              days: handleDaysCalculation(visitData.startDate)
            } as VisitCard

            // updating the current state
            setScheduledVisits((prev:VisitCard[])=>prev.filter(v=>v._id!=_id));
            setCompletedVisits((prev:VisitCard[])=>([formattedVisit,...prev]));
    
            message.success("Visit Completed");
        } catch (error: any) {
            console.log(error)
            message.error(error?.data || "Something went wrong, please try again");
        }
      },
    });
  }

  return (
    <>
    <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
      {/* Active Visits Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">
            Active Visits
            <Badge variant="outline" className="ml-3 bg-emerald-50 text-emerald-700 border-emerald-200">
              {scheduledVisits.length} Upcoming
            </Badge>
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              className="rounded-full h-9 w-9 border-slate-200 text-slate-700"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
              className="rounded-full h-9 w-9 border-slate-200 text-slate-700"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>

        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            
            {
              isLoading?
              <Row className="h-[20vh] w-full" align='middle' justify='center'>
                  <Spin indicator={<LoadingOutlined  spin/>} size='large'/>
              </Row>
              
              :!scheduledVisits.length?
              <Row justify='center' align='middle' className="flex-col w-full mt-8 mb-8">
                <FaDropbox className='text-[#9c9fa0]' size={80}/>
                <Typography className='text-[#828485]'>No Data</Typography>
              </Row>
              :scheduledVisits.map((visit) => {
                const appointedPatient = patientsData.find((d:any)=>d._id==visit.patient);
                return (
                  <div
                    key={visit._id}
                    className="embla__slide min-w-0 sm:min-w-[350px] flex-grow-0 flex-shrink-0 basis-[85%] sm:basis-[320px] pr-4"
                  >
                    <Card data-testid='scheduled-visit-card' onClick={()=>{setOpenViewVisit(true); setSelectedCard(visit);}} className="h-full overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer">
                      <div className={`h-1.5 w-full ${getUrgencyColor(visit.days)}`} />
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 border-2 border-slate-100">
                              <AvatarImage src={visit.image} alt={`${visit.name} profile`} />
                              <AvatarFallback className="bg-slate-100 text-slate-700 font-medium">
                                {visit.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-slate-800">{visit.name}</h3>
                              <div className="flex items-center text-xs text-slate-500">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                {visit.days}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`
                              ${
                                visit.days.includes("3 days")
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : visit.days.includes("5 days")
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }
                            `}
                          >
                            {visit.days}
                          </Badge>
                        </div>

                        <div className="space-y-3 mt-4">
                          <div className="flex items-center justify-between py-2 border-b border-slate-100">
                            <span className="text-sm font-medium text-slate-600">Contact</span>
                            <div className="flex items-center text-sm text-slate-800">
                              <Phone className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                              {visit.contact}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="px-5 py-4 bg-slate-50 flex justify-between gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-1/2 border-rose-200 bg-primaryColor hover:bg-primaryColor"
                          onClick={(e)=>{
                            e.stopPropagation();
                            handleCompleteVisit(visit);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1.5" />
                          Complete Visit
                        </Button>
                        <Button 
                          size="sm" 
                          className="w-1/2 bg-secondaryColor text-white"
                          onClick={(e)=>{
                            e.stopPropagation();
                            setSelectedCard(visit);
                            if(appointedPatient) setSelectedPatient(appointedPatient);
                            setOpenEditVisit(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4 mr-1.5" />
                          Edit
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )
              })
            }

          </div>
        </div>
      </div>

      {/* Recently Ended Visits Section */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">
            Recently Ended
            <Badge variant="outline" className="ml-3 bg-slate-100 text-slate-700 border-slate-200">
              {completedVisits.length} Visits
            </Badge>
          </h2>
          <Link
            href="/doctor/medicalhistory"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center"
          >
            See All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {  
          isLoading?
          <Row className="h-[20vh] w-full" align='middle' justify='center'>
              <Spin indicator={<LoadingOutlined  spin/>} size='large'/>
          </Row>
          :!completedVisits.length?
          <Row justify='center' align='middle' className="flex-col w-full mt-16 mb-8">
            <FaDropbox className='text-[#9c9fa0]' size={75}/>
            <Typography className='text-[#828485]'>No Data</Typography>
          </Row>
          :<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {
            completedVisits.slice(0, 6).map((visit) => (
              <Card key={visit._id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                <div className="h-1.5 w-full bg-slate-300" />
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-slate-100">
                        <AvatarImage src={visit.image} alt={`${visit.name} profile`} />
                        <AvatarFallback className="bg-slate-100 text-slate-700 font-medium">
                          {visit.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-slate-800">{visit.name}</h3>
                        <div className="flex items-center text-xs text-slate-500">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {visit.days}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-sm font-medium text-slate-600">Contact</span>
                      <div className="flex items-center text-sm text-slate-800">
                        <Phone className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                        {visit.contact}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-5 py-4 bg-slate-50 flex justify-center">
                  <Button onClick={() => router.push("medicalhistory") } variant="outline" className="w-full border-slate-200 text-slate-700 bg-secondaryColor">
                    <ClipboardList className="h-4 w-4 mr-1.5" />
                    View History
                  </Button>
                </CardFooter>
              </Card>
            ))
          }
          </div>
        }
      </div>
    </div>

    <EditVisitModal
      open={openEditVisit}
      setOpen={setOpenEditVisit}
      visit={selectedCard}
      selectedPatient={selectedPatient}
      setScheduledVisits={setScheduledVisits}
      setPatientsData={setPatientsData}
    />

    <ViewVisit
      open={openViewVisit}
      setOpen={setOpenViewVisit}
      visit={selectedCard}
    />
    </>
  )
}

export default ActiveVisits
