import { PatientLoginPayload, PrescriptionResponse } from "@/types/patient";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PatientSignupPayload } from "@/types/patient";
import {
  VisitModel,
  Prescription,
  PrescriptionWithStatus,
  VisitsResponse,
} from "@/components/models/visitModel";
import { PatientResponse } from "@/types/patient";

export const patientApi = createApi({
  reducerPath: "patientApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://healthsync-backend-bfrv.onrender.com/api",
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", `application/json`);
      return headers;
    },
  }),
  tagTypes: ["Patient", "Visits"],
  endpoints: (builder) => ({
    // POST
    loginPatient: builder.mutation<any, PatientLoginPayload>({
      query: (patient) => ({
        url: "/login/patient",
        method: "POST",
        body: patient,
      }),
    }),

    registerPatient: builder.mutation<any, PatientSignupPayload>({
      query: (patient) => ({
        url: "/register/patient",
        method: "POST",
        body: patient,
      }),
    }),

    requestVisit: builder.mutation<any, VisitModel>({
      query: (visit) => ({
        url: "/visits",
        method: "POST",
        body: visit,
      }),
      invalidatesTags: ["Visits"],
    }),

    // DELETE
    deletePatient: builder.mutation<void, void>({
      query: () => ({
        url: "/patients/me",
        method: "DELETE",
      }),
    }),

    // GET
    getPatientById: builder.query<any, string>({
      query: (id) => ({
        url: `/patients/${id}`,
        method: "GET",
      }),
    }),

    getVisitsByDoctorIdPatientId: builder.query<
      any,
      { doctor_id: string; patient_id: string }
    >({
      query: ({ doctor_id, patient_id }) => ({
        url: `/visits?doctor_id=${doctor_id}&patient_id=${patient_id}&approval=Scheduled&status=Scheduled`,
        method: "GET",
      }),
      providesTags: ["Visits"],
    }),

    getVisitsByPatientId: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/visits?patient_id=${id}`,
        method: "GET",
      }),
    }),

    getScheduledVisits: builder.query<PrescriptionWithStatus[], string>({
      query: (patient_id: string) => ({
        url: `/visits?patient_id=${patient_id}&status=Scheduled`,
        method: "GET",
      }),
      transformResponse: (
        response: VisitsResponse
      ): PrescriptionWithStatus[] => {
        const allPrescriptions = response.data.visits.flatMap(
          (visit: VisitModel) =>
            visit.prescription?.map((prescription: Prescription) => ({
              ...prescription,
              visitDate: new Date(visit.preferredDate).toISOString(),
              status: "Taken" as const,
            })) || []
        );
        return allPrescriptions;
      },
      providesTags: ["Visits"],
    }),

    getOnlyScheduledVisits: builder.query<VisitsResponse, string>({
      query: (patient_id: string) => ({
        url: `/visits?patient_id=${patient_id}&status=Scheduled`,
        method: "GET",
      }),
    }),

    getUpcomingAppointments: builder.query<VisitModel[], string>({
      query: (patient_id) => ({
        url: `/visits?patient_id=${patient_id}&approval=Scheduled`,
        method: "GET",
      }),
      transformResponse: (response: VisitsResponse) => response.data.visits,
      providesTags: ["Visits"],
    }),

    getUpcomingActiveAppointments: builder.query<VisitModel[], string>({
      query: (patient_id) => ({
        url: `/visits?patient_id=${patient_id}&approval=Scheduled&status=Scheduled`,
        method: "GET",
      }),
      transformResponse: (response: VisitsResponse) => response.data.visits,
      providesTags: ["Visits"],
    }),

    getCurrentPatient: builder.query<PatientResponse, void>({
      query: () => "/patients/me",
      transformResponse: (response: {
        data: PatientResponse;
        success: boolean;
      }) => response.data,
      providesTags: ["Patient"],
    }),

    // PATCH
    updatePatient: builder.mutation<PatientResponse, Partial<PatientResponse>>({
      query: (updatedData) => ({
        url: "/patients/me",
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["Patient"],
    }),

    getPrescriptionsByPatientId: builder.query<any, string>({
      query: (patient_id) => ({
        url: `/patients/${patient_id}/me/prescriptions?limit=1000`,
        method: "GET",
      }),
      transformResponse: (response: PrescriptionResponse) =>
        response.data.prescriptions,
      providesTags: ["Visits"],
    }),
  }),
});

export const {
  useLoginPatientMutation,
  useRegisterPatientMutation,
  useDeletePatientMutation,
  useRequestVisitMutation,
  useGetPatientByIdQuery,
  useGetVisitsByDoctorIdPatientIdQuery,
  useGetScheduledVisitsQuery,
  useGetCurrentPatientQuery,
  useUpdatePatientMutation,
  useGetUpcomingAppointmentsQuery,
  useGetVisitsByPatientIdQuery,
  useGetOnlyScheduledVisitsQuery,
  useLazyGetPatientByIdQuery,
  useGetUpcomingActiveAppointmentsQuery,
  useGetPrescriptionsByPatientIdQuery,
} = patientApi;

export const fetchPatient = async (_id: string) => {
  try {
    // Importing store dynamically since there is circular dependency between patientApi.ts and store.tsx
    const storeModule = await import("../store");
    const store = storeModule.default;

    const result = await store.dispatch(
      patientApi.endpoints.getPatientById.initiate(_id)
    );

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

export const loginPatient = async (
  password: string,
  phone?: string,
  email?: string
) => {
  try {
    // Importing store dynamically since there is circular dependency between patientApi.ts and store.tsx
    const storeModule = await import("../store");
    const store = storeModule.default;

    const result = await store.dispatch(
      patientApi.endpoints.loginPatient.initiate({
        ...(phone ? { phone } : {}),
        password,
        ...(email ? { email } : {}),
      })
    );

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
