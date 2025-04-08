import { Box, Typography } from "@mui/material";
import { Row } from "antd";
import { motion } from "framer-motion";
import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

type SlideUpAnimationProb = {
    initial:any,
    animate:any,
    exit:any,
    transition:any
}
type AuthProps = {
    slideUpAnimation: SlideUpAnimationProb;
    setShowSecondPage?: (value: boolean) => void
};
// const Auth = ({slideUpAnimation}:{slideUpAnimation:SlideUpAnimationProb})=>{
//     const [tab,setTab] = useState<0|1>(0);
const Auth = ({ slideUpAnimation, setShowSecondPage }: AuthProps) => {
    const [tab, setTab] = useState<0 | 1>(0);

    return (
        <motion.div
            key="secondPage"
            className="absolute inset-0 bg-gray-800 overflow-auto"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={slideUpAnimation.transition}
        >
            <Box className='bg-[url("../public/images/landing-bg.png")] bg-cover bg-center min-h-screen flex justify-center items-center'>
                <Row className="w-full md:w-[85%] h-fit bg-neutral-100 py-10 flex flex-col md:flex-row">
                    {/* Health sync text */}
                    <Box className="w-full md:w-[50%] h-auto flex justify-center items-center flex-col gap-11 p-4 md:p-0">
                        <Typography className="text-primary text-7xl font-bold max-sm:text-xl max-sm:flex-[0.6] cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowSecondPage?.(false)}>
                          Health<span className="text-accent">Sync</span>
                        </Typography>
                        <Typography className="text-center w-[70%]">
                            An AI-powered platform that connects patients with verified doctors, enabling virtual consultations, prescriptions, and healthcare management
                        </Typography>
                    </Box>

                    {/* Forms */}
                    <Row className="w-full md:w-[50%] px-10 mt-10 md:mt-0">
                        <Row className="w-full h-[44px] rounded-3xl bg-[#D9D9D9] relative overflow-hidden">
                            {/* Sliding Indicator */}
                            <div
                                className={`absolute h-full w-[50%] bg-primary rounded-3xl transition-transform duration-300`}
                                style={{
                                  transform: tab === 0 ? 'translateX(0)' : 'translateX(100%)',
                                }}
                            />
                            <Row
                                className={`w-[50%] justify-center items-center cursor-pointer z-10 transition-colors duration-300 ${
                                    tab === 0 ? 'text-neutral-100' : 'text-black'
                                }`}
                                onClick={() => setTab(0)}
                            >
                                <Typography>Login</Typography>
                            </Row>
                            <Row
                                className={`w-[50%] justify-center items-center cursor-pointer z-10 transition-colors duration-300 ${
                                    tab === 1 ? 'text-neutral-100' : 'text-black'
                                }`}
                                onClick={() => setTab(1)}
                            >
                                <Typography>Signup</Typography>
                            </Row>
                        </Row>
                        { tab === 0 ? <Login setTab={setTab}/> : <Signup setParentTab={setTab}/> }
                    </Row>
                </Row>
            </Box>
        </motion.div>
    )
}

export default Auth;