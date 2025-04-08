import { UserModel } from "./user";

export interface DoctorModel extends Omit<UserModel,'role'> {
    firstname: string;
    lastname: string;
    age: number;
    gender: "male" | "female";
    specializations: string[];
    qualifications: string[];
    licenses: LicenseModel[];
    role: string;
    hospital: HospitalModel;
}

export interface LicenseModel {
    url: string;
    type: string;
    isVerified?: boolean;
}


interface HospitalModel {
    address: {
        street: string;
        city: string;
        region: string;
        country: string;
        postalCode: string;
    };
    _id: string;
    name: string;
    branch: number;
    __v: number;
}


