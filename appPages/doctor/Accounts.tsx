"use client"

import type React from "react"
import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { CheckCircle, Clock, Upload, FileText, Edit } from "lucide-react"
import imgg from '@/public/images/doctor.png'
;
const profileSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
  gender: z.string().min(1, "Gender is required"),
  age: z.number().min(0, "Age must be a positive number").max(120, "Age must be realistic"),
  specialization: z.string().optional(),
})

const documentSchema = z.object({
  document: z.instanceof(File).refine((file) => file.type === "application/pdf", "Only PDF files are allowed"),
})

type ProfileFormValues = z.infer<typeof profileSchema>
type DocumentFormValues = z.infer<typeof documentSchema>
const isVerified = true

const Accounts = () => {
  const [verifiedDocuments, setVerifiedDocuments] = useState<string[]>(["Gynaecology certification"])
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "Dr Belete Abebe",
      phoneNumber: "",
      gender: "",
      age: 0,
      specialization: "Gynaecology",
    },
  })

  const documentForm = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
  })

  const onProfileSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    console.log(data)
  }

  const onDocumentSubmit: SubmitHandler<DocumentFormValues> = (data) => {
    console.log(data)
    if (data.document) {
      setVerifiedDocuments((prev) => [...prev, data.document.name])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name)
    }
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
                <h2 className="font-bold text-2xl text-slate-800">Dr Belete Abebe</h2>
                <p className="text-slate-500">Beleteabebe@gmail.com</p>
                {isVerified ? (
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
                    <span>Verification Pending</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...profileForm.register("fullName")} placeholder="Your Full Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...profileForm.register("phoneNumber")} placeholder="Your Phone Number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={(value) => profileForm.setValue("gender", value)}
                    defaultValue={profileForm.getValues("gender")}
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

                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...profileForm.register("age", { valueAsNumber: true })}
                      placeholder="Your Age"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem className="md:col-span-2">
                  <FormLabel>Specialization</FormLabel>
                  <FormControl>
                    <Input {...profileForm.register("specialization")} placeholder="Your Medical Specialization" />
                  </FormControl>
                  <FormDescription>Enter your primary medical specialization</FormDescription>
                  <FormMessage />
                </FormItem>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-secondaryColor hover:bg-emerald-600 text-white">
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* this is forLicense Documents Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-slate-800">License Documents</CardTitle>
          <CardDescription>Manage your medical license and certification documents</CardDescription>
        </CardHeader>
        <CardContent>
          {verifiedDocuments.length > 0 && (
            <div className="mb-6 space-y-4">
              <h3 className="text-sm font-medium text-slate-500">Verified Documents</h3>
              {verifiedDocuments.map((doc, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50">
                  <div className="p-2 rounded-md bg-slate-100">
                    <FileText className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-700">{doc}</p>
                    <p className="text-xs text-slate-500">Verified 1 month ago</p>
                  </div>
                  <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-200 bg-emerald-50">
                    <CheckCircle className="h-3 w-3" />
                    <span>Verified</span>
                  </Badge>
                </div>
              ))}
            </div>
          )}

          <Separator className="my-6" />

          <Form {...documentForm}>
            <form onSubmit={documentForm.handleSubmit(onDocumentSubmit)} className="space-y-6">
              <FormItem>
                <FormLabel>Upload New Document</FormLabel>
                <FormDescription>Upload your medical license or certification (PDF only)</FormDescription>
                <FormControl>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-slate-400 mb-2" />
                        {uploadedFileName ? (
                          <p className="text-sm text-slate-700 font-medium">{uploadedFileName}</p>
                        ) : (
                          <>
                            <p className="mb-1 text-sm text-slate-700 font-medium">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-slate-500">PDF (MAX. 10MB)</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        {...documentForm.register("document")}
                        accept="application/pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>

              <div className="flex justify-end">
                <Button type="submit" className="bg-secondaryColor hover:bg-emerald-600 text-white">
                  Submit Document
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Accounts
