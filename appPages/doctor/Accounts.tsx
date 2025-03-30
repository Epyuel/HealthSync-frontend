"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { GiHourglass } from "react-icons/gi";
import ppimage from '@/public/images/doctor.png';
import { FaFile } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";

const profileSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
  gender: z.string().min(1, "Gender is required"),
  age: z
    .number()
    .min(0, "Age must be a positive number")
    .max(120, "Age must be realistic"),
  specialization: z.string().optional(),
});

const documentSchema = z.object({
  document: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", "Only PDF files are allowed"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type DocumentFormValues = z.infer<typeof documentSchema>;
const isVerified = true;

const Accounts = () => {
  const [verifiedDocuments, setVerifiedDocuments] = useState<string[]>(['file']);
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      gender: "",
      age: 0, 
      specialization: "",
    },
  });

  const documentForm = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
  });

  const onProfileSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    console.log(data);
  };

  const onDocumentSubmit: SubmitHandler<DocumentFormValues> = (data) => {
    console.log(data);
    // Simulate document verification
    if (data.document) {
      setVerifiedDocuments((prev) => [...prev, data.document.name]);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4">
                <Image src={ppimage} alt="profile image" className="rounded-full w-20 h-20" />
                <div className="flex flex-col items-start justify-center gap-3">
                    <p className="font-bold text-xl">Dr Belete Abebe</p>
                    <p>Beleteabebe@gmail.com</p>
                </div>
            </div>
            {isVerified ? (
              <div className="flex items-center gap-2 text-green-500 mt-4 md:mt-0">
                <IoMdCheckmarkCircle size={40} />
                <p>Licence Verified</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-500 mt-4 md:mt-0">
                <GiHourglass size={40} />
                <p>Licence verification Pending</p>
              </div>
            )}
        </div>
        <div className="flex-1">
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem className="flex flex-col">
                  <FormLabel className="text-md">Full Name</FormLabel>
                  <FormControl>
                    <input
                      {...profileForm.register("fullName")}
                      className="input border p-2 rounded-md"
                      placeholder="Your Full Name"
                    />
                  </FormControl>
                  <FormMessage>{profileForm.formState.errors.fullName?.message}</FormMessage>
                </FormItem>
                <FormItem className="flex flex-col">
                  <FormLabel className="text-md">Phone Number</FormLabel>
                  <FormControl>
                    <input
                      {...profileForm.register("phoneNumber")}
                      className="input border p-2 rounded-md"
                      placeholder="Your Phone Number"
                    />
                  </FormControl>
                  <FormMessage>{profileForm.formState.errors.phoneNumber?.message}</FormMessage>
                </FormItem>
                <FormItem className="flex flex-col">
                  <FormLabel className="text-md">Gender</FormLabel>
                  <FormControl>
                    <input
                      {...profileForm.register("gender")}
                      className="input border p-2 rounded-md"
                      placeholder="Your Gender"
                    />
                  </FormControl>
                  <FormMessage>{profileForm.formState.errors.gender?.message}</FormMessage>
                </FormItem>
                <FormItem className="flex flex-col">
                  <FormLabel className="text-md">Age</FormLabel>
                  <FormControl>
                    <input
                      type="number"
                      {...profileForm.register("age", { valueAsNumber: true })}
                      className="input border p-2 rounded-md"
                      placeholder="Your Age"
                    />
                  </FormControl>
                  <FormMessage>{profileForm.formState.errors.age?.message}</FormMessage>
                </FormItem>
                <FormItem className="flex flex-col">
                  <FormLabel className="text-md">Specialization</FormLabel>
                  <FormControl>
                    <input
                      {...profileForm.register("specialization")}
                      className="input border p-2 rounded-md"
                      placeholder="Your Specialization"
                    />
                  </FormControl>
                  <FormMessage>{profileForm.formState.errors.specialization?.message}</FormMessage>
                </FormItem>
              </div>
              <div className="mt-6 flex justify-end">
                <Button type="submit" className="btn btn-primary text-white bg-secondaryColor">
                  Request Edit
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="flex-1">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-bold">Licence Documents</h2>
            {verifiedDocuments.length > 0 ? (
              <div className="flex items-center gap-4 mt-4">
                <FaFile size={30} className="text-primary"/>
                <div className="flex flex-start flex-col">
                    <p>Gynaecology certification</p>
                    <p>1 month ago</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No verified documents</p>
            )}
            <Form {...documentForm}>
              <form onSubmit={documentForm.handleSubmit(onDocumentSubmit)}>
                <FormItem className="flex flex-col mt-4">
                  <FormLabel className="text-md">Upload Document (PDF only)</FormLabel>
                <FormControl>
                    <label className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-primary transition-colors">
                        <FaCloudUploadAlt className="mr-2 text-gray-500" size={20} />
                        <span className="text-gray-600">Drag & drop a PDF file here, or click to select</span>
                        <input
                            type="file"
                            {...documentForm.register("document")}
                            className="hidden"
                            accept="application/pdf"
                        />
                    </label>
                </FormControl>
                  <FormMessage>{documentForm.formState.errors.document?.message}</FormMessage>
                </FormItem>
                <div className="mt-4 flex justify-end">
                  <Button type="submit" className="btn btn-primary bg-secondaryColor text-white">
                    Request document change
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
