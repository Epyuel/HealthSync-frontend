"use client"

import React, { useState, useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormDescription, FormField } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { CheckCircle, Clock, Upload, FileText, Edit, Trash2 } from "lucide-react"
import imgg from '@/public/images/doctor.png';
import {useUpdateDoctorMutation} from "@/redux/api/doctorApi"
import { useSessionUser } from "@/components/context/Session"
import { DoctorResponse } from "@/types/doctor"
import CloudinaryUploader from "@/components/doctor-components/CloudinaryUploader"
import { message, Select } from "antd"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { specializations } from "@/data/DoctorData"

const profileSchema = z.object({
  firstname: z.string().min(1, "First Name is required"),
  lastname: z.string().min(1, "Last Name is required"),
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
  gender: z.string().min(1, "Gender is required"),
  age: z.number().min(0, "Age must be a positive number").max(120, "Age must be realistic"),
  specializations: z.array(z.string()), 
  email: z.string().email("Invalid email address").optional(), 
})

const documentSchema = z.object({
  document: z.instanceof(File).refine((file) => file.type === "application/pdf", "Only PDF files are allowed"),
})

type ProfileFormValues = z.infer<typeof profileSchema>
type DocumentFormValues = z.infer<typeof documentSchema>
type Document = { url: string; type: string; isVerified: boolean }

const Accounts = () => {
  const { user } = useSessionUser(); 
  const doctor = user; 

  const [updateDoctor, { isLoading: isUpdatingDoctor }] = useUpdateDoctorMutation();
  const [newlyUploadedDocuments, setNewlyUploadedDocuments] = useState<Document[]>([]);
  const [preExistingDocuments, setPreExistingDocuments] = useState<Document[]>([]);
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      phoneNumber: "",
      gender: "",
      age: 0,
      specializations: [],
      email: "",
    },
  });

  console.log("Doctor dataaaaaaaaaaaaaaa:", doctor);

  useEffect(() => {
    if (doctor) {
      profileForm.reset({
        firstname: doctor.firstname || "",
        lastname: doctor.lastname || "",
        phoneNumber: doctor.phoneNumber || "",
        gender: doctor.gender || "male",
        age: doctor.age || 0,
        specializations: doctor.specializations,
        email: doctor.email || "",
      });
      setPreExistingDocuments(doctor.licenses || []);
      setNewlyUploadedDocuments([]);
    }
  }, [doctor]);

  const documentForm = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
  });

  const handleLicenseUpload = (url: string) => {
    const newLicense = { url, type: "pdf", isVerified: false };
    setNewlyUploadedDocuments((prev) => [...prev, newLicense]);
  };

  const handleDeleteDocument = (url: string) => {
    setNewlyUploadedDocuments((prev) => prev.filter((doc) => doc.url !== url));
  };

  const onProfileSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    if (!doctor?._id) return;
    const { email, phoneNumber, ...rest } = data; // Exclude email and phoneNumber from the data
    const updatedData = {
      ...rest,
      specializations: rest.specializations,
      licenses: newlyUploadedDocuments, // Include only newly uploaded licenses
    };
    console.log("Submitting profile data:", updatedData);
    try {
      await updateDoctor({ body: updatedData }).unwrap();
      message.success("Profile updated successfully!");
      setPreExistingDocuments((prev) => [...prev, ...newlyUploadedDocuments]);
      setNewlyUploadedDocuments([]);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      message.error(error?.data?.error || "Failed to update profile.");
    }
  };

  const isDoctorVerified = doctor?.status === "approved";

  if (!doctor) {
    return <div className="container mx-auto p-4">Loading doctor information...</div>;
  }

  return (
    <div className="container mx-auto pb-8 px-4">
      <Card className="mb-8 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-slate-800">Personal Information</CardTitle>
          <CardDescription>Your profile information visible to patients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 bg-gradient-to-r from-teal-50 via-teal-300 to-teal-600 p-4 rounded-lg shadow-xl">
            <div className="flex items-center gap-5">
              <div className="relative">
                <Image
                  src={imgg} 
                  alt="profile image"
                  width={100}
                  height={100}
                  className="rounded-full object-cover border-4 border-white shadow-md"
                />
                <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit profile picture</span>
                </Button>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-bold text-2xl text-slate-800">
                  Dr {doctor?.firstname || ""} {doctor?.lastname || ""}
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-slate-500">{doctor?.email || "No email provided"}</p>
                  <Badge
                    variant="outline"
                    className="mt-1 gap-1 text-orange-400 border-emerald-200 bg-emerald-50 w-fit"
                  >
                    <span>{doctor?.gender}</span>
                  </Badge>
                  <Badge
                    variant="outline"
                    className="mt-1 gap-1 text-orange-400 border-emerald-200 bg-emerald-50 w-fit"
                  >
                    <span>{doctor?.age} years old</span>
                  </Badge>
                </div>
                {isDoctorVerified ? (
                  <Badge
                    variant="outline"
                    className="mt-1 gap-1 text-emerald-600 border-emerald-200 bg-emerald-50 w-fit"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Verified Doctor</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mt-1 gap-1 text-amber-600 border-amber-200 bg-amber-50 w-fit">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{doctor?.status ? `Status: ${doctor.status}` : "Verification Pending"}</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={profileForm.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your First Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your Last Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your Email Address" type="email" readOnly={!!doctor?.email} />
                      </FormControl>
                      <FormDescription>Email address (cannot be changed if already set).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your Phone Number" readOnly={!!doctor?.phoneNumber} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={profileForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={doctor?.gender || "male"} // Initialize with gender from user object
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                {/* <FormField
                  control={profileForm.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={event => field.onChange(+event.target.value)}
                          placeholder="Your Age"
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={profileForm.control}
                  name="specializations"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="mb-1 block">Specializations</FormLabel>
                      <Select
                        className="w-1/2 pr-2"
                        mode="multiple"
                        showSearch
                        value={field.value}
                        onChange={field.onChange}
                        options={specializations.map((value) => ({
                          label: value,
                          value,
                        }))}
                      />
                      <FormDescription>
                        choose your medical specializations.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium text-slate-700">Upload Licenses</h3>
                <CloudinaryUploader onUploadSuccess={handleLicenseUpload} />
                {(preExistingDocuments.length > 0 || newlyUploadedDocuments.length > 0) && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-slate-600">Uploaded Licenses:</h4>
                    <ul className="list-disc list-inside">
                      {preExistingDocuments.map((doc, index) => (
                        <li key={`pre-${index}`} className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="link" className="text-blue-500 hover:underline">
                                License {index + 1} ({doc.type})
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>License {index + 1}</DialogTitle>
                              </DialogHeader>
                              <iframe
                                src={doc.url}
                                className="w-full h-[500px] border rounded-md"
                                title={`License ${index + 1}`}
                              />
                            </DialogContent>
                          </Dialog>
                          {doc.isVerified && (
                            <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                              Verified
                            </Badge>
                          )}
                        </li>
                      ))}
                      {newlyUploadedDocuments.map((doc, index) => (
                        <li key={`new-${index}`} className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="link" className="text-blue-500 hover:underline">
                                License {preExistingDocuments.length + index + 1} ({doc.type})
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>License {preExistingDocuments.length + index + 1}</DialogTitle>
                              </DialogHeader>
                              <iframe
                                src={doc.url}
                                className="w-full h-[500px] border rounded-md"
                                title={`License ${preExistingDocuments.length + index + 1}`}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteDocument(doc.url)}
                            className="h-6 w-6 p-0"
                            title="Delete this license"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-secondaryColor hover:bg-emerald-600 text-white" disabled={isUpdatingDoctor}>
                  {isUpdatingDoctor ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Accounts;