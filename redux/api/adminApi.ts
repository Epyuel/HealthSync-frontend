import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AdminLoginPayload } from "@/types/admin";


export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://healthsync-backend-bfrv.onrender.com/api",
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", `application/json`);
      return headers;
    },
  }),
  tagTypes: ["Admin"],
  endpoints: (builder) => ({

    // for admin to login
    loginAdmin: builder.mutation<any, AdminLoginPayload>({
        query: (admin) => ({
          url: '/login/admin',
          method: 'POST',
          body: admin
        }),
    }),

    // for admin to get all the patients. it is paginated
    getAllPatients: builder.query<any, {page:number,limit:number}>({
      query: ({page,limit}) => ({
        url: `/patients?page=${page}&limit=${limit}`,
        method: 'GET' 
      }),     
    }),

    // for admin to get all the doctors. it is paginated
    getAllDoctors: builder.query<any, {page:number,limit:number}>({
      query: ({page,limit}) => ({
        url: `/doctors?page=${page}&limit=${limit}`,
        method: 'GET' 
      })      
    }),

    // to get a patient by id
    getAdminById: builder.query<any, string>({
      query: (id) => ({
        url: `/admin/${id}`,
        method: 'GET',
      }),
    }),

    // endpoint to display the stat chart in the admin dashboard
    getStatInfo: builder.query<any, { year: number }>({
      query: ({ year }) => ({
        url: `/figures/engagements?year=${year}`,
        method: 'GET' 
      }),     
    }),

  }),
});

export const {
  useLoginAdminMutation,
  useGetAllPatientsQuery,
  useGetAllDoctorsQuery,
  useGetAdminByIdQuery,
  useGetStatInfoQuery,
} = adminApi;

export const fetchAdmin = async (_id:string) => {
  try {
    // Importing store dynamically since there is circular dependency between adminApi.ts and store.tsx
    const storeModule = await import("../store");
    const store = storeModule.default;

    const result = await store.dispatch(adminApi.endpoints.getAdminById.initiate(_id));

    if ("error" in result) {
      console.error("Error fetching doctors:", result.error);
      return null;
    }

    return result.data; // Returns the fetched doctors
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

export const loginAdmin = async (password:string,phone?:string,email?:string) => {
  try {
    // Importing store dynamically since there is circular dependency between adminApi.ts and store.tsx
    const storeModule = await import("../store");
    const store = storeModule.default;

    const result = await store.dispatch(adminApi.endpoints.loginAdmin.initiate({...(phone?{phone}:{}),password,...(email?{email}:{})}));

    if ("error" in result) {
      console.error("Error fetching doctors:", result.error);
      return null;
    }

    return result.data; // Returns the fetched doctors
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};