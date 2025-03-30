'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { X } from 'lucide-react';
import { allergyOptions, conditionOptions, allergyOptionsEnglish, conditionOptionsEnglish } from '@/data/PatientData';
import Logout from '@/components/auth/Logout';

const PatientProfile = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    phoneNumber: '',
    gender: '',
    age: '',
    cardNumber: '',
    timeZone: '',
    firstName: '', 
    allergies: [] as string[],
    knownConditions: [] as string[],
  });

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectAllergy = (value: string) => {
    const englishWord = allergyOptionsEnglish[allergyOptions.indexOf(value)];
    if (englishWord && !profile.allergies.includes(englishWord)) {
      setProfile((prev) => ({
        ...prev,
        allergies: [...prev.allergies, englishWord],
      }));
    }
  };

  const handleSelectCondition = (value: string) => {
    const englishWord = conditionOptionsEnglish[conditionOptions.indexOf(value)];
    if (englishWord && !profile.knownConditions.includes(englishWord)) {
      setProfile((prev) => ({
        ...prev,
        knownConditions: [...prev.knownConditions, englishWord],
      }));
    }
  };

  const removeAllergy = (allergyToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((allergy) => allergy !== allergyToRemove),
    }));
  };

  const removeCondition = (conditionToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      knownConditions: prev.knownConditions.filter((condition) => condition !== conditionToRemove),
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Profile submitted:', profile);
  };

  const genders = ['Male', 'Female'];

  return (
    <div className="container mx-auto p-6 md:p-0">
      <form onSubmit={handleSubmit}>
        <Card className="rounded-xl bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
          <CardHeader className="p-4 rounded-xl">
            <div className="w-full flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 md:w-40 md:h-40 bg-gray-300">
                  <AvatarImage src="/images/patient-placeholder.png" alt="Patient Yeabsira" />
                  <AvatarFallback className='bg-primaryColor text-white'>PY</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg text-gray-600 font-semibold">Patient Yeabsira</p>
                  <p className="text-md text-gray-500">yeabsira2000@gmail.com</p>
                  {/* Logout for small screens */}
                  <div className="mt-4 md:hidden">
                    <Logout/>
                  </div>
                </div>
              </div>
              {/* Logout for medium and larger screens */}
              <div className="hidden md:block">
                <Logout/>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <Input
                id="fullName"
                placeholder="Your Full Name"
                value={profile.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="border-gray-300 bg-gray-100 focus:border-gray-400 p-5"
              />
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <Input
                id="phoneNumber"
                placeholder="Your Phone Number"
                value={profile.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="border-gray-300 bg-gray-100 focus:border-gray-400 p-5"
              />
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
              <Select
                value={profile.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
              >
                <SelectTrigger className="border-gray-300 bg-gray-100 focus:border-gray-400 p-5">
                  <SelectValue placeholder="Your Gender" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
              <Input
                id="age"
                placeholder="Your Age"
                value={profile.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="border-gray-300 bg-gray-100 focus:border-gray-400 p-5"
              />
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
              <Input
                id="cardNumber"
                placeholder="Your Card Number"
                value={profile.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                className="border-gray-300 bg-gray-100 focus:border-gray-400 p-5"
              />
              <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700">Time Zone</label>
              <Select
                value={profile.timeZone}
                onValueChange={(value) => handleInputChange('timeZone', value)}
              >
                <SelectTrigger className="border-gray-300 bg-gray-100 focus:border-gray-400 p-5">
                  <SelectValue placeholder="Your Time Zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC+3">UTC+3 (East Africa Time)</SelectItem>
                  <SelectItem value="UTC-5">UTC-5 (Eastern Time, USA)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Allergies Section with Dropdown and Selected Items */}
            <div className="col-span-1 md:col-span-2 space-y-2">
              <h3 className="text-sm font-medium text-gray-800">Allergies</h3>
              <Select
                onValueChange={handleSelectAllergy}
                value=""
              >
                <SelectTrigger className="border-gray-300 bg-gray-100 focus:border-gray-400 w-full p-5">
                  <SelectValue placeholder="Select an Allergy" />
                </SelectTrigger>
                <SelectContent>
                  {allergyOptions.map((allergy) => (
                    <SelectItem key={allergy} value={allergy}>
                      {allergy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {profile.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.allergies.map((allergy, index) => (
                    <div key={index} className="relative items-center bg-gray-500 border border-gray-300 rounded-md p-2 inline-block">
                      <span className="text-sm flex-1 text-white">{allergy}</span>
                      <button
                        type="button"
                        onClick={() => removeAllergy(allergy)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <h3 className="text-sm font-medium text-gray-800">Known Conditions</h3>
              <Select
                onValueChange={handleSelectCondition}
                value=""
              >
                <SelectTrigger className="border-gray-300 bg-gray-100 focus:border-gray-400 w-full p-5">
                  <SelectValue placeholder="Select a Condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditionOptions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {profile.knownConditions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.knownConditions.map((condition, index) => (
                    <div key={index} className="relative items-center bg-gray-500 border border-gray-300 rounded-md p-2 inline-block">
                      <span className="text-sm text-white flex-1">{condition}</span>
                      <button
                        type="button"
                        onClick={() => removeCondition(condition)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-end">
              <Button
                type="submit"
                className="bg-secondaryColor hover:bg-orange-400 px-6 py-2 rounded-md text-white"
              >
                Save Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default PatientProfile;