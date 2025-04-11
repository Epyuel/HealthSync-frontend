"use client";

import React, { useContext, useEffect, useState } from "react";
import { Session } from "next-auth";
import AppContext from "./AppContext";
import { useRouter,usePathname } from "next/navigation";
import { DoctorModel } from "../models/doctor";
import { PatientModel } from "../models/patient";
import { AdminModel } from "../models/admin";
import { Row, Spin } from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import { fetchMe } from "@/redux/api/commonApi";


type sessionProps = {
    children: React.ReactNode;
};

export default function NextAuthSessionProvider({ children }: sessionProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const pathName = usePathname();
    const [sessionData, setSessionData] = useState<Session | null>(null);
    const [user, setUser] = useState<DoctorModel & PatientModel & AdminModel| null>(null);

    useEffect(() => {
        {
            (async () => {
                const role = localStorage.getItem('role') as any
                let res;
                const request = pathName?.split('/').at(1)

                if(['admin','patients','doctors'].includes(role) && (pathName == '/' || (request=="admin"?request:request+'s')== role)){
                    res = await fetchMe(role)
                }

                if (!res?.data && pathName!=='/sign-up') {
                    router.push("/");
                }else {
                    setUser(res.data);

                    if (window.location.pathname === "/") {
                        router.push(
                            role=='doctors'?
                            "/doctor/dashboard"
                            :role=='patients'?
                            "/patient/dashboard"
                            :role=='admin'?
                            "/admin/dashboard"
                            :"/"
                        );
                    }
                }

                setTimeout(()=>{
                    setLoading(false);
                },500)
            })()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <AppContext.Provider value={{ user, setUser }}>
            {loading ? <Row className="w-full h-[100vh]" justify='center' align='middle'><Spin indicator={<LoadingOutlined spin />} size="large"/></Row> : children}
        </AppContext.Provider>
    );
}

export const useSessionUser = () => {
    const context:any = useContext(AppContext)
    return {user:context.user,setUser:context.setUser }
}

