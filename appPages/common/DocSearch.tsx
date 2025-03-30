import Image from "next/image";
import ppimage from "@/public/images/doctor.png";
import { IoMdCheckmarkCircle } from "react-icons/io";
import Rating from "@/components/common-components/Rating";
import { Button, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import { DoctorModel } from "@/components/models/doctor";
import { LoadingOutlined } from '@ant-design/icons';
import { useGetVerifiedDoctorsQuery } from "@/redux/api/doctorApi";
import { RequestVisitModal } from "@/components/patient-components/modals/RequestVisit";

interface prob{
    doctorID:string
}

const DocSearch = ({doctorID}:prob)=>{
    const [doctor,setDoctor] = useState<DoctorModel>();
    const [openRequestVisit,setOpenRequestVisit] = useState(false);

    const { data, status, error, isLoading } = useGetVerifiedDoctorsQuery();
    
    
    useEffect(()=>{
        const doctors: DoctorModel[] = data?.data?.doctors??[];
        const doctor = doctors.find(d=>d._id==doctorID);
        if(doctor) setDoctor(doctor);
    },[data?.data?.doctors, doctorID])

    return(
        <>
            <div className="p-6">
                {
                    error?
                    <Row className="h-[60vh]"><p className="text-sm text-gray-500">Something went wrong</p></Row>

                    :isLoading?
                    <Row className="h-[60vh]" align='middle' justify='center'>
                        <Spin indicator={<LoadingOutlined  spin/>} size='large'/>
                    </Row>

                    :doctor?
                    <>
                        <h1 className="text-2xl font-bold mb-6">Profile</h1>
                        <div className="flex flex-col gap-y-[3rem]">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <Image src={ppimage} alt="profile image" className="rounded-full w-20 h-20" />
                                    <div className="flex flex-col items-start justify-center gap-3">
                                        <p className="font-bold text-xl">Dr. {doctor.firstname} {doctor?.lastname?.at(0)?.toUpperCase()}</p>
                                        <p>{doctor.email??''}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-green-500 mt-4 md:mt-0">
                                    <IoMdCheckmarkCircle size={40} />
                                    <p>License Verified</p>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="flex justify-between gap-3 sm:w-[85%]">
                                    <div className="flex flex-col gap-8">
                                        <div className="flex flex-col">
                                            <p className="font-bold text-lg">Full Name</p>
                                            <p>{doctor.firstname} {doctor.lastname}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-bold text-lg">Phone Number</p>
                                            <p>{doctor.phoneNumber}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-bold text-lg">Gender</p>
                                            <p>{doctor.gender}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-bold text-lg">Age</p>
                                            <p>{doctor.age}</p>
                                        </div>
                                        
                                    </div>
                                    <div className="flex flex-col gap-8">
                                        <div className="flex flex-col">
                                            <p className="font-bold text-lg">Specialization</p>
                                            <p>{doctor.specializations.join(', ')}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-bold text-lg">Qualification</p>
                                            <p>{doctor.qualifications.join(', ')}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-bold text-lg">Location</p>
                                            <p>{'Addis Ababa, Bole'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Row className="h-[10rem] flex justify-center items-center gap-3 bg-[#72bbb7] rounded-xl sm:justify-between sm:px-10">
                                <Rating isView={true} value={3}/>
                                <Button 
                                    className="primary-button squared-button"
                                    onClick={()=>setOpenRequestVisit(true)}
                                >
                                    Request Visit
                                </Button>
                            </Row>
                        </div>
                    </>

                    :<Row className="h-[60vh]" align='middle' justify='center'><p className="text-sm text-gray-500">No data</p></Row>
                }
            </div>

            <RequestVisitModal
                open={openRequestVisit}
                setOpen={setOpenRequestVisit}
                doctor={doctor ?? {} as DoctorModel}
            />
        </>
    )
}

export default DocSearch;