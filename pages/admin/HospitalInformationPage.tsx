"use client"

import { useState, useEffect } from "react"
import {
  useGetAllHospitalsQuery,
  useGetHospitalByIdQuery,
  useDeleteHospitalMutation,
  useUpdateHospitalMutation,
} from "@/redux/api/hospitalApi"
import { AlertCircle, CheckCircle2, Edit, Loader2, Plus, Trash2, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

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

type Hospital = {
  _id: string
  name: string
  branch: number
  address: {
    street: string
    city: string
    region: string
    country: string
    postalCode: string
  }
}

type NotificationType = {
  type: "success" | "error"
  title: string
  message: string
}

type HospitalInformationPageProps = {
  setActiveHospitalTab: (tab: "information" | "add") => void
}

export default function HospitalInformationPage({ setActiveHospitalTab }: HospitalInformationPageProps) {
  const [notification, setNotification] = useState<NotificationType | null>(null)
  const [hospitalToDelete, setHospitalToDelete] = useState<Hospital | null>(null)
  const [hospitalToEdit, setHospitalToEdit] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { data, isLoading, error, refetch } = useGetAllHospitalsQuery()
  const { data: hospitalData, isLoading: isLoadingHospital } = useGetHospitalByIdQuery(hospitalToEdit || "", {
    skip: !hospitalToEdit || !isEditDialogOpen,
  })
  const [deleteHospital, { isLoading: isDeleting }] = useDeleteHospitalMutation()
  const [updateHospital, { isLoading: isUpdating }] = useUpdateHospitalMutation()

  const hospitals = data?.data?.hospitals || []
  const totalCount = data?.data?.totalCount || 0

  // Initialize the form
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

  // Update form values when hospital data is loaded - with safeguards against infinite loops
  useEffect(() => {
    if (hospitalData?.data && isEditDialogOpen) {
      const hospital = hospitalData.data
      form.reset({
        name: hospital.name,
        branch: hospital.branch,
        address: {
          street: hospital.address.street,
          city: hospital.address.city,
          region: hospital.address.region,
          country: hospital.address.country,
          postalCode: hospital.address.postalCode,
        },
      })
    }
  }, [hospitalData, isEditDialogOpen]) // Remove form from dependencies

  const handleEditClick = (hospitalId: string) => {
    // Reset form before setting new hospital to edit
    form.reset({
      name: "",
      branch: undefined,
      address: {
        street: "",
        city: "",
        region: "",
        country: "",
        postalCode: "",
      },
    })

    // First open the dialog, then set the hospital to edit
    setIsEditDialogOpen(true)
    setHospitalToEdit(hospitalId)
  }

  const handleDeleteClick = (hospital: Hospital) => {
    setHospitalToDelete(hospital)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!hospitalToDelete) return

    try {
      await deleteHospital(hospitalToDelete._id).unwrap()
      setNotification({
        type: "success",
        title: "Hospital deleted",
        message: `${hospitalToDelete.name} has been successfully removed.`,
      })
      setIsDeleteDialogOpen(false)
      refetch() // Refresh the list
    } catch (error: any) {
      setNotification({
        type: "error",
        title: "Failed to delete hospital",
        message: error.data?.message || "An unexpected error occurred. Please try again.",
      })
    }
  }

  const onSubmitEdit = async (data: FormValues) => {
    if (!hospitalToEdit) return

    try {
      await updateHospital({
        id: hospitalToEdit,
        hospital: data,
      }).unwrap()

      setNotification({
        type: "success",
        title: "Hospital updated",
        message: `${data.name} has been successfully updated.`,
      })

      // Close dialog first, then clear hospital to edit
      setIsEditDialogOpen(false)
      setTimeout(() => {
        setHospitalToEdit(null)
      }, 100)

      refetch() // Refresh the list
    } catch (error: any) {
      setNotification({
        type: "error",
        title: "Failed to update hospital",
        message: error.data?.message || "An unexpected error occurred. Please try again.",
      })
    }
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    // Use setTimeout to ensure state updates don't conflict
    setTimeout(() => {
      setHospitalToEdit(null)
    }, 100)
  }

  const dismissNotification = () => {
    setNotification(null)
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading hospitals...</p>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Alert className="bg-red-50 border-red-200 text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle>Error loading hospitals</AlertTitle>
          <AlertDescription>There was a problem loading the hospitals. Please try again later.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hospitals</h1>
          <p className="text-muted-foreground mt-1">Manage all hospitals in the platform. Total: <span className="text-secondaryColor font-bold">{totalCount}</span></p>
        </div>
        <Button onClick={() => setActiveHospitalTab("add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Hospital
        </Button>
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

      {hospitals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No hospitals found</p>
            <Button onClick={() => setActiveHospitalTab("add")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Hospital
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hospital Name</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hospitals.map((hospital: Hospital) => (
                      <TableRow key={hospital._id}>
                        <TableCell className="font-medium">{hospital.name}</TableCell>
                        <TableCell>{hospital.branch}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {hospital.address.city}, {hospital.address.country}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[250px] truncate">
                          {hospital.address.street}, {hospital.address.postalCode}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleEditClick(hospital._id)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteClick(hospital)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {hospitals.map((hospital: Hospital) => (
              <Card key={hospital._id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{hospital.name}</CardTitle>
                      <CardDescription>Branch: {hospital.branch}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditClick(hospital._id)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteClick(hospital)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {hospital.address.city}, {hospital.address.country}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {hospital.address.street}, {hospital.address.postalCode}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {hospitalToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Hospital Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseEditDialog()
          }
        }}
      >
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Edit Hospital</DialogTitle>
            <DialogDescription>Update the details for this hospital. Click save when you are done.</DialogDescription>
          </DialogHeader>

          {isLoadingHospital ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-6">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="col-span-4">
                          <FormLabel>Hospital Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter hospital name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem className="col-span-4">
                          <FormLabel>Branch Number</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter branch number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-4">
                    <h3 className="text-sm font-medium mb-2">Address Information</h3>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem className="col-span-4">
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter street address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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

                <DialogFooter>
                  <Button variant="outline" type="button" onClick={handleCloseEditDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

