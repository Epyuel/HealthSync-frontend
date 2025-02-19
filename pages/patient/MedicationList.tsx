'use client';

import React from 'react';

interface Medication {
  name: string;
  dosage: string;
  instructions: string;
  status: 'taken' | 'missed';
}

const medications: Medication[] = [
  { name: 'Fenofibrate', dosage: '48mg', instructions: 'Take With Food Every Morning', status: 'taken' },
  { name: 'Alfuzosin', dosage: '10mg', instructions: 'Take 1 With Food Twice A Day And Avoid Drinking Alcohol For 2 Hours After', status: 'missed' },
  { name: 'Dexamethasone', dosage: '4mg', instructions: 'Take 3 Tablets 3 Times A Day For 7 Days', status: 'taken' },
];

const statusColors = {
  taken: 'bg-[#00A99D]',
  missed: 'bg-[#D92550]',
};

const MedicationCard: React.FC<{ medication: Medication }> = ({ medication }) => {
  return (
    <div className="w-[273px] flex justify-between items-center p-4 bg-white shadow-md rounded-lg border border-gray-200">
      <div>
        <h3 className="font-semibold text-gray-800">
          {medication.name} <span >({medication.dosage})</span>
        </h3>
        <p className="text-[9px] text-[#282828]">{medication.instructions}</p>
      </div>
      <div className="cursor-pointer font-bold text-gray-600 text-3xl">⋮</div>
    </div>
  );
};

const StatusIndicator: React.FC<{ label: string; color: string }> = ({ label, color }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
};

const MedicationList: React.FC = () => {
  return (
    <div className="max-w-md pb-10 pt-5 ml-2">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Active Medications</h2>
      <div className="space-y-4">
        {medications.map((med, index) => (
         <div key={index} className='flex gap-5'>
            <MedicationCard medication={med} />
            {index % 2 == 0 ? <StatusIndicator label="Taken" color={statusColors.taken} /> : <StatusIndicator label="Missed" color={statusColors.missed} />}
         </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationList;
