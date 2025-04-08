"use client";

import { useState } from "react";
import { AnimatePresence } from 'framer-motion';
import GettingStarted from "./Home";
import Auth from "../auth/Auth";

const Landing = () => {
    const [showSecondPage, setShowSecondPage] = useState(false);

    const slideUpAnimation = {
        initial: { y: 0 },
        animate: { y: '-100%' },
        exit: { y: '-100%' },
        transition: { duration: 0.7, ease: 'easeInOut' },
    };

    return (
        <>
            <div className="relative h-screen overflow-hidden">
                <AnimatePresence>
                    {!showSecondPage ? (
                        <GettingStarted
                            key="firstPage" 
                            slideUpAnimation={slideUpAnimation} 
                            setShowSecondPage={setShowSecondPage}
                        />
                    ) : (
                        <Auth 
                            key="secondPage" 
                            slideUpAnimation={slideUpAnimation}
                            setShowSecondPage={setShowSecondPage}
                        />
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}

export default Landing;