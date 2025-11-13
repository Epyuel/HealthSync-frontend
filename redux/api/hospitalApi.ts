import { hospitalPostPayload } from "@/types/hospital";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hospitalApi = createApi({
  reducerPath: "hospitalApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://healthsync-backend-bfrv.onrender.com/api",
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", `application/json`);
      return headers;
    },
  }),
  tagTypes: ["Hospital"],
  endpoints: (builder) => ({
    // Get all hospitals with pagination
    getAllHospitals: builder.query<any, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: `/hospitals`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Hospital"],
    }),

    getAllHospitalsSearch: builder.query<any, void>({
      query: () => ({
        url: `/hospitals`,
        method: "GET",
      }),
      providesTags: ["Hospital"],
    }),

    // Get hospital by ID
    getHospitalById: builder.query<any, string>({
      query: (id) => ({
        url: `/hospitals/${id}`,
        method: "GET",
      }),
      providesTags: ["Hospital"],
    }),

    // Post a hospital
    postHospital: builder.mutation<any, hospitalPostPayload>({
      query: (hospital) => ({
        url: "/hospitals",
        method: "POST",
        body: hospital,
      }),
      invalidatesTags: ["Hospital"],
    }),

    // Update a hospital
    updateHospital: builder.mutation<
      any,
      { id: string; hospital: hospitalPostPayload }
    >({
      query: ({ id, hospital }) => ({
        url: `/hospitals/${id}`,
        method: "PATCH",
        body: hospital,
      }),
      invalidatesTags: ["Hospital"],
    }),

    // Delete a hospital
    deleteHospital: builder.mutation<any, string>({
      query: (id) => ({
        url: `/hospitals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hospital"],
    }),
  }),
});

export const {
  useGetAllHospitalsQuery,
  useGetHospitalByIdQuery,
  usePostHospitalMutation,
  useUpdateHospitalMutation,
  useDeleteHospitalMutation,
  useGetAllHospitalsSearchQuery,
} = hospitalApi;
