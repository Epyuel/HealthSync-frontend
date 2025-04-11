"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { usePostHospitalMutation } from "@/redux/api/hospitalApi"
import { Loader2, CheckCircle2, AlertCircle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define the form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Hospital name must be at least 2 characters" }),
  branch: z.coerce.number().int().positive({ message: "Branch must be a positive number" }),
  address: z.object({
    street: z.string().min(1, { message: "Street is required" }),
    city: z.string().min(1, { message: "City is required" }),
    region: z.string().min(1, { message: "Region is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    postalCode: z.string().min(1, { message: "Postal code is required" }),
  }),
})

type FormValues = z.infer<typeof formSchema>

type NotificationType = {
  type: "success" | "error"
  title: string
  message: string
}

export default function AddHospitalPage() {
  const router = useRouter()
  const [notification, setNotification] = useState<NotificationType | null>(null)
  const [postHospital, { isLoading }] = usePostHospitalMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      branch: undefined,
      address: {
        street: "",
        city: "",
        region: "",
        country: "",
        postalCode: "",
      },
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      await postHospital(data).unwrap()

      setNotification({
        type: "success",
        title: "Hospital added successfully",
        message: `${data.name} has been added to the platform.`,
      })

      form.reset()
    } catch (error: any) {
      setNotification({
        type: "error",
        title: "Failed to add hospital",
        message: error.data?.message || "An unexpected error occurred. Please try again.",
      })
    }
  }

  const dismissNotification = () => {
    setNotification(null)
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Add New Hospital</h1>
        <p className="text-muted-foreground mt-2">Fill in the details below to add a new hospital to the platform.</p>
      </div>

      {notification && (
        <Alert
          className={`mb-6 ${notification.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}
        >
          <div className="flex items-start">
            {notification.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            )}
            <div className="ml-3 flex-1">
              <AlertTitle className="text-base font-medium">{notification.title}</AlertTitle>
              <AlertDescription className="text-sm">{notification.message}</AlertDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={dismissNotification}>
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Hospital Information</CardTitle>
          <CardDescription>Enter the basic information and address details for the new hospital.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter hospital name" {...field} />
                      </FormControl>
                      <FormDescription>The official name of the hospital.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Number</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter branch number" {...field} />
                      </FormControl>
                      <FormDescription>Unique identifier for this branch.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Address Information</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter street address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region/State</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter region or state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Hospital
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

