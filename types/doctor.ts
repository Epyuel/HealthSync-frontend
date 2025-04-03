export interface DoctorLoginPayload {
    phone?: string;
    email?: string;
    password: string;
}
// export type DoctorSignupPayload = Omit<Doctor, "_id"> & { password: string };
//since the DoctorSignupPayload is the same as Doctor but with an additional password field, we can use Omit to create the type

export interface DoctorSignupPayload {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phoneNumber: string;
    age: number
    hospital?: string
    gender: 'male' | 'female';
    role: string;
    specializations: string[];
    qualifications: string[];
    licenses: DoctorLicense[];
}


interface DoctorLicense {
    url: string;
    type: string;
    isVerified: boolean;
}
export interface Doctor {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  age: number;
  gender: string;
  phoneNumber: string;
  specializations: string[];
  qualifications: string[];
  licenses: {
    url: string;
    type: string;
    isVerified: boolean;
    _id: string;
  }[];
}
export interface DoctorApiResponse {
  success: boolean;
    data: Doctor;
    message?: string;
}

interface License {
  url: string;
  type: string;
  isVerified: boolean;
  _id: string;
}

interface Address {
  street: string;
  city: string;
  region: string;
  country: string;
  postalCode: string;
}

interface Hospital {
  address: Address;
  _id: string;
  name: string;
  branch: number;
  __v: number;
}

export interface DoctorResponse {
  bookmarks: any[]; 
  status: "pending" | "approved" | "rejected"; 
  banned: boolean;
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  age: number;
  gender: "male" | "female"
  role: string;
  phoneNumber: string;
  specializations: string[];
  qualifications: string[];
  licenses: License[];
  hospital: Hospital;
  createdAt: string; 
  updatedAt: string;
  __v: number;
}
