"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Calendar, CreditCard, Clock, X, Plus, Save, AlertCircle, Activity, Shield } from "lucide-react"
import { allergyOptions, conditionOptions, allergyOptionsEnglish, conditionOptionsEnglish } from "@/data/PatientData"
import Logout from "@/components/auth/Logout"

const PatientProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "Yeabsira Tekeste",
    phoneNumber: "+251 91 234 5678",
    gender: "Male",
    age: "24",
    timeZone: "UTC+3",
    firstName: "Yeabsira",
    allergies: ["Penicillin", "Peanuts"] as string[],
    knownConditions: ["Asthma"] as string[],
  })

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSelectAllergy = (value: string) => {
    const englishWord = allergyOptionsEnglish[allergyOptions.indexOf(value)]
    if (englishWord && !profile.allergies.includes(englishWord)) {
      setProfile((prev) => ({
        ...prev,
        allergies: [...prev.allergies, englishWord],
      }))
    }
  }

  const handleSelectCondition = (value: string) => {
    const englishWord = conditionOptionsEnglish[conditionOptions.indexOf(value)]
    if (englishWord && !profile.knownConditions.includes(englishWord)) {
      setProfile((prev) => ({
        ...prev,
        knownConditions: [...prev.knownConditions, englishWord],
      }))
    }
  }

  const removeAllergy = (allergyToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((allergy) => allergy !== allergyToRemove),
    }))
  }

  const removeCondition = (conditionToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      knownConditions: prev.knownConditions.filter((condition) => condition !== conditionToRemove),
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log("Profile submitted:", profile)
  }

  const genders = ["Male", "Female"]

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Patient Profile</h1>
        <p className="text-gray-500">Manage your personal information and medical details</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="bg-gradient-to-r from-teal-100 via-teal-300 to-teal-600 h-32 relative rounded-xl"></div>
            <CardHeader className="relative pb-0 pt-0 -mt-16 rounded-xl">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6 pb-6 rounded-xl">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white shadow-lg">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" alt={profile.fullName} />
                  <AvatarFallback className="bg-teal-100 text-teal-800 text-xl">
                    {profile.firstName.charAt(0)}Y
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 pt-16 md:pt-0">
                  <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                  <p className="text-gray-500">yeabsira2000@gmail.com</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      {profile.gender} • {profile.age} years
                    </Badge>
                  </div>
                </div>
                <div className="md:self-start pt-4 md:pt-0">
                  <Logout />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="personal" className="w-full">
            <div className="w-full flex justify-center items-center">
            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="medical">Medical Information</TabsTrigger>
            </TabsList>
            </div>

            <TabsContent value="personal" className="mt-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Personal Details</h3>
                  <p className="text-sm text-gray-500">Update your personal information</p>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      Full Name
                    </label>
                    <Input
                      id="fullName"
                      placeholder="Your Full Name"
                      value={profile.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="border-gray-200 focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="text-sm font-medium flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      Phone Number
                    </label>
                    <Input
                      id="phoneNumber"
                      placeholder="Your Phone Number"
                      value={profile.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="border-gray-200 focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="gender" className="text-sm font-medium flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      Gender
                    </label>
                    <Select value={profile.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className="border-gray-200 focus:border-teal-500">
                        <SelectValue placeholder="Select Gender" />
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

                  <div className="space-y-2">
                    <label htmlFor="age" className="text-sm font-medium flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      Age
                    </label>
                    <Input
                      id="age"
                      placeholder="Your Age"
                      value={profile.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className="border-gray-200 focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="timeZone" className="text-sm font-medium flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      Time Zone
                    </label>
                    <Select value={profile.timeZone} onValueChange={(value) => handleInputChange("timeZone", value)}>
                      <SelectTrigger className="border-gray-200 focus:border-teal-500">
                        <SelectValue placeholder="Select Time Zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC+3">UTC+3 (East Africa Time)</SelectItem>
                        <SelectItem value="UTC+0">UTC+0 (Greenwich Mean Time)</SelectItem>
                        <SelectItem value="UTC-5">UTC-5 (Eastern Time, USA)</SelectItem>
                        <SelectItem value="UTC-8">UTC-8 (Pacific Time, USA)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical" className="mt-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Medical Information</h3>
                  <p className="text-sm text-gray-500">Manage your allergies and medical conditions</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={18} className="text-red-500" />
                      <h4 className="font-medium">Allergies</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select onValueChange={handleSelectAllergy} value="">
                        <SelectTrigger className="border-gray-200 focus:border-teal-500 flex-1">
                          <SelectValue placeholder="Add an allergy" />
                        </SelectTrigger>
                        <SelectContent>
                          {allergyOptions.map((allergy) => (
                            <SelectItem key={allergy} value={allergy}>
                              {allergy}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0 border-gray-200 text-gray-500"
                      >
                        <Plus size={16} />
                        <span className="sr-only">Add Allergy</span>
                      </Button>
                    </div>

                    {profile.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.allergies.map((allergy, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1.5"
                          >
                            {allergy}
                            <button
                              type="button"
                              onClick={() => removeAllergy(allergy)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              <X size={14} />
                              <span className="sr-only">Remove {allergy}</span>
                            </button>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No allergies added</p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Activity size={18} className="text-teal-600" />
                      <h4 className="font-medium">Medical Conditions</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select onValueChange={handleSelectCondition} value="">
                        <SelectTrigger className="border-gray-200 focus:border-teal-500 flex-1">
                          <SelectValue placeholder="Add a medical condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditionOptions.map((condition) => (
                            <SelectItem key={condition} value={condition}>
                              {condition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0 border-gray-200 text-gray-500"
                      >
                        <Plus size={16} />
                        <span className="sr-only">Add Condition</span>
                      </Button>
                    </div>

                    {profile.knownConditions.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.knownConditions.map((condition, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-teal-50 text-teal-700 hover:bg-teal-100 px-3 py-1.5"
                          >
                            {condition}
                            <button
                              type="button"
                              onClick={() => removeCondition(condition)}
                              className="ml-2 text-teal-500 hover:text-teal-700"
                            >
                              <X size={14} />
                              <span className="sr-only">Remove {condition}</span>
                            </button>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No medical conditions added</p>
                    )}
                  </div>

                  <Separator />

{/* some medical condition privacy should be given */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Shield className="text-gray-400 shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Medical Information Privacy</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Your medical information is protected and will only be shared with healthcare providers involved
                        in your care.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" className="border-gray-200">
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-300 hover:bg-teal-700 text-white">
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PatientProfile
