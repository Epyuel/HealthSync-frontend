"use client"
import UserManagement from "@/components/admin-components/UserManagement"
import BannedDoctors from "@/components/admin-components/BannedDoctors"
import BannedPatients from "@/components/admin-components/BannedPatients"
import { useState, useEffect } from "react"

const UserManagementPage = () => {
  const [activeTab, setActiveTab] = useState("AllUsers")
  const [activeHospitalTab, setActiveHospitalTab] = useState("BannedDoc")

  useEffect(() => {
    if (activeTab === "AllUsers") {
      setActiveHospitalTab("BannedDoc")
    }
  }, [activeTab])

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div
          className={`text-center cursor-pointer flex-1 pb-2 ${activeTab === "AllUsers" ? "border-b-4 border-primaryColor" : ""}`}
          onClick={() => setActiveTab("AllUsers")}
        >
          All Users
        </div>
        <div
          className={`text-center cursor-pointer flex-1 pb-2 ${activeTab === "Banned" ? "border-b-4 border-primaryColor" : ""}`}
          onClick={() => setActiveTab("Banned")}
        >
          Banned Users
        </div>
      </div>

      {activeTab === "AllUsers" ? (
        <UserManagement />
      ) : (
        <div>
          <div className="w-full md:w-1/2 mx-auto mt-4 mb-4">
            <div className="flex">
              <div
                className={`w-1/2 text-center cursor-pointer pb-2 ${activeHospitalTab === "BannedDoc" ? "border-b-2 border-secondaryColor font-medium" : ""}`}
                onClick={() => setActiveHospitalTab("BannedDoc")}
              >
                Banned Doctors
              </div>
              <div
                className={`w-1/2 text-center cursor-pointer pb-2 ${activeHospitalTab === "BannedPat" ? "border-b-2 border-secondaryColor font-medium" : ""}`}
                onClick={() => setActiveHospitalTab("BannedPat")}
              >
                Banned Patients
              </div>
            </div>
          </div>
          <div className="mt-2">
            {activeHospitalTab === "BannedDoc" ? (
              <BannedDoctors />
            ) : (
              <BannedPatients />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagementPage

