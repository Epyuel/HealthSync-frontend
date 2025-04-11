export interface AdminLoginPayload {
    email?: string;
    password: string;
}


export interface UsersStatResponse {
    totalDoctors: number;
    totalPatients: number;
    totalNewDoctors: number;
    totalNewPatients: number;
}