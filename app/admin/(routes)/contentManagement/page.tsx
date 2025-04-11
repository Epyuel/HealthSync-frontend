"use client"
import ContentManagement from "@/components/admin-components/ContentManagement"
import AddHospitalPage from "@/appPages/admin/AddHospitalPage"
import HospitalInformationPage from "@/appPages/admin/HospitalInformationPage"
import { useState, useEffect } from "react"

const Content = () => {
  const [activeTab, setActiveTab] = useState("hospital")
  const [activeHospitalTab, setActiveHospitalTab] = useState("information")

  // Reset hospital tab to information when switching main tabs
  useEffect(() => {
    if (activeTab === "hospital") {
      setActiveHospitalTab("information")
    }
  }, [activeTab])

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div
          className={`text-center cursor-pointer flex-1 pb-2 ${activeTab === "blog" ? "border-b-4 border-primaryColor" : ""}`}
          onClick={() => setActiveTab("blog")}
        >
          Blog Management
        </div>
        <div
          className={`text-center cursor-pointer flex-1 pb-2 ${activeTab === "hospital" ? "border-b-4 border-primaryColor" : ""}`}
          onClick={() => setActiveTab("hospital")}
        >
          Hospital Management
        </div>
      </div>

      {activeTab === "blog" ? (
        <ContentManagement />
      ) : (
        <div>
          {/* Updated hospital sub-tabs container with full width on mobile */}
          <div className="w-full md:w-1/2 mx-auto mt-4 mb-4">
            <div className="flex">
              <div
                className={`w-1/2 text-center cursor-pointer pb-2 ${activeHospitalTab === "information" ? "border-b-2 border-secondaryColor font-medium" : ""}`}
                onClick={() => setActiveHospitalTab("information")}
              >
                Hospital Information
              </div>
              <div
                className={`w-1/2 text-center cursor-pointer pb-2 ${activeHospitalTab === "add" ? "border-b-2 border-secondaryColor font-medium" : ""}`}
                onClick={() => setActiveHospitalTab("add")}
              >
                Add Hospital
              </div>
            </div>
          </div>
          <div className="mt-2">
            {activeHospitalTab === "information" ? (
              <HospitalInformationPage setActiveHospitalTab={setActiveHospitalTab} />
            ) : (
              <AddHospitalPage />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Content

