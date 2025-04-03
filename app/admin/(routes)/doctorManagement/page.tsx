'use client';
import Link from 'next/link';
import React, { useState } from 'react'
import IncomingLicenses from '@/components/admin-components/IncomingLicenses';
import AcceptedLicenses from '@/components/admin-components/AcceptedLicenses';
import DeniedLicenses from '@/components/admin-components/DeniedLicenses';


const DoctorManagement = () => {
  const [index, setindex] = useState(0)
  return (
    <div className='space-y-8'>
      <h1 className='font-bold text-xl'>Doctor and Request Management</h1>
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <div className="list-group flex items-center justify-between border-b-2">
              <Link href="" className={`list-group-item list-group-item-action italic ${index === 0 ? "border-b-4 border-primaryColor text-secondaryColor" : ""}`} onClick={() => setindex(0)}>Incoming License Verification</Link>
              <Link href="" className={`list-group-item list-group-item-action italic ${index === 1 ? "border-b-4 border-primaryColor text-secondaryColor" : ""}`} onClick={() => setindex(1)}>Accepted Doctors (License)</Link>
              <Link href="" className={`list-group-item list-group-item-action italic ${index === 2 ? "border-b-4 border-primaryColor text-secondaryColor" : ""}`} onClick={() => setindex(2)}>Denied Doctors (License)</Link>
            </div>
          </div>
          <div className="col-md-9">
            {index === 0 && <IncomingLicenses />}
            {index === 1 && <AcceptedLicenses />}
            {index === 2 && <DeniedLicenses />}
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default DoctorManagement
