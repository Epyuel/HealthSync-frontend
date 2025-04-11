// DiagnosisComponent.tsx
import Image from 'next/image';
import React from 'react';
import imgg from '@/public/images/doctor.png';
import { 
  Stethoscope, 
  Pill, 
} from 'lucide-react';
import { CiHeart } from "react-icons/ci";
import { FaFileMedicalAlt } from "react-icons/fa";
import { HiOutlineDocumentText } from 'react-icons/hi';

interface Vitals {
  bloodGlucose: string;
  weight: string;
  heartRate: string;
  oxygenSaturation: string;
  bodyTemperature: string;
  bloodPressure: string;
}

interface Symptoms {
  headache: string;
  nausea: string;
  heartRate: string;
}

interface Medication {
  name: string;
  dosage: string;
  time: string;
}

interface TestReport {
  name: string;
  time: string;
  report: string;
}

interface DiagnosisData {
  doctorName: string;
  doctorTitle: string;
  appointment: string;
  vitals: Vitals;
  symptoms: Symptoms;
  diagnoses: string[];
  medications: Medication[];
  notes: string;
  testReports: TestReport[];
}

const diagnosisData: DiagnosisData = {
  doctorName: 'Dr. Ermiyas Kinde, MS.',
  doctorTitle: 'Orthopedists Specialist',
  appointment: '3 Round Appointment',
  vitals: {
    bloodGlucose: '120 mg/dL',
    weight: '55 Kg',
    heartRate: '70 bpm',
    oxygenSaturation: '7%',
    bodyTemperature: '98.1°F',
    bloodPressure: '120/80 mm Hg',
  },
  symptoms: {
    headache: 'Headache',
    nausea: 'Nausea',
    heartRate: 'Heart rate',
  },
  diagnoses: ['Severe Nerve Disorder(SND)', 'UTI', 'UTI'],
  medications: [
    {
      name: 'Indexer 20',
      dosage: '1 Pill',
      time: '02:00 PM'
    },
    {
      name: 'Ursofalk 300',
      dosage: '2 Pills',
      time: '02:00 PM'
    }
  ],
  notes: 'Take medication before meal',
  testReports: [
    {
      name: 'UV Invasive Ultrasound',
      time: '02:00 PM',
      report: 'A small nerve in the left-mid section of the neck has shown swollen properties. A brain scan is suggested'
    },
    {
      name: 'Blood Test',
      time: '02:00 PM',
      report: 'HIV - A small nerve in the left-mid section of the neck has shown swollen properties. A brain scan is suggested'
    }
  ],
};

const DiagnosisComponent: React.FC = () => {
  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b">
        <div className="flex items-center mb-4 sm:mb-0">
          <Image
            src={imgg}
            alt={`${diagnosisData.doctorName} profile`}
            className="w-12 h-12 rounded-full mr-4"
            width={48}
            height={48}
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{diagnosisData.doctorName}</h2>
            <p className="text-sm text-gray-600">{diagnosisData.doctorTitle}</p>
          </div>
        </div>
        <div className="bg-blue-100 px-4 py-2 rounded-lg">
          <span className="text-sm font-semibold text-blue-800">{diagnosisData.appointment}</span>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        {/* Vitals */}
      <div className="rounded-lg border shadow-md">
        <div className="flex items-center px-4 bg-gray-50 gap-2 rounded-md w-fit mt-2 ml-4 py-1">
          <CiHeart className='text-gray-600 font-bold' size={25}/>
          <p className="text-gray-400 font-semibold">Vitals</p>
        </div>
        <div className="flex flex-wrap justify-between mb-6 px-4 pt-3 gap-5">
          {Object.entries(diagnosisData.vitals).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <span className="text-sm font-semibold text-gray-600 capitalize">{key}</span>
              <p className="text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div className="rounded-lg border shadow-md">
        <div className="flex items-center px-4 bg-gray-50 gap-2 rounded-md w-fit mt-2 ml-4 py-1">
          <FaFileMedicalAlt className='text-gray-400 font-bold' size={25}/>
          <p className="text-gray-400 font-semibold">Symptoms</p>
        </div>
        <div className="flex flex-wrap items-center gap-5 md:gap-24 mb-6 px-4 pt-3">
          {Object.entries(diagnosisData.symptoms).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <span className="text-sm font-semibold text-gray-600 capitalize">{key}</span>
              <p className="text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      </div>


      {/* Diagnosis & Medications */}
      <div className="flex flex-wrap items-start justify-between border rounded-md shadow-md">
        <div className="">
          <div className="flex items-center px-4 bg-gray-50 gap-2 rounded-md w-fit mt-2 ml-4 py-1">
            <Stethoscope className='text-gray-500 font-bold' size={25}/>
            <p className="text-gray-400 font-semibold">Diagnosis</p>
          </div>
          <ul className="space-y-1 p-4">
            {diagnosisData.diagnoses.map((diagnosis, index) => (
              <li key={index} className="text-gray-800">{diagnosis}</li>
            ))}
          </ul>
        </div>

        
        <div className="">
          <div className="flex items-center px-4 bg-gray-50 gap-2 rounded-md w-fit mt-2 ml-4 py-1">
              <Pill className='text-gray-500 font-bold' size={25}/>
              <p className="text-gray-400 font-semibold">Medications</p>
          </div>
          <div className="space-y-1 p-4">
            {diagnosisData.medications.map((med, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{med.name}</span>
                <span className="text-sm text-gray-600">{med.dosage} - {med.time}</span>
              </div>
            ))}
          </div>
        </div>

          {/* Notes */}
          <div className="mb-6 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes</h3>
            <p className="text-gray-800">{diagnosisData.notes}</p>
        </div>
      </div>

      {/* Test Reports */}
      <div className="border rounded-lg shadow-md">
        <div className="flex items-center px-4 bg-gray-50 gap-2 rounded-md w-fit mt-2 ml-4 py-1">
          <HiOutlineDocumentText size={25} className='text-gray-500 font-bold'/>
          <span className='text-gray-400 font-semibold'>Test Reports</span>
        </div>
        <div className="space-y-4 p-4">
          {/* UV Invasive Ultrasound */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex-shrink-0 w-full md:w-1/5">
              <p className="text-sm font-medium">UV Invasive Ultrasound</p>
              <p className="text-xs text-gray-500">02:00 PM</p>
            </div>
            <div className="flex-1 w-full md:w-4/5 border-l-2 border-gray-400 pl-4">
              <p className="text-sm">Nerve Disorder</p>
              <p className="text-sm">
              A small nerve in the left-mid section of the neck has shown swollen
              properties. A brain scan is suggested
              </p>
            </div>
            </div>

          {/* Blood Test */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex-shrink-0 w-full md:w-1/5">
              <p className="text-sm font-medium">Blood Test</p>
              <p className="text-xs text-gray-500">02:00 PM</p>
            </div>
            <div className="flex-1 w-full md:w-4/5 border-l-2 border-gray-400 pl-4">
              <p className="text-sm">HIV -</p>
              <p className="text-sm">
              A small nerve in the left-mid section of the neck has shown swollen
              properties. A brain scan is suggested
              </p>
            </div>
            </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default DiagnosisComponent;