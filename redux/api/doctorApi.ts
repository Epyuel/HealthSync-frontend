import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DoctorLoginPayload, DoctorSignupPayload } from "@/types/doctor";
// import { get } from "http";
import { DoctorApiResponse, DoctorsListApiResponse } from "@/types/doctor";
import { VisitsResponse } from "@/types/visit";
import { notificationsApi } from "./notificationsApi";

interface InteractionPayload {
  medicines:string[],
  medical_conditions:string[],
  type:'dd_interaction'|'md_interaction',
}

interface Chat{
  text:string,
  type:'chat'
}

export const doctorApi = createApi({
  reducerPath: "doctorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://healthsync-backend-bfrv.onrender.com/api",
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", `application/json`);
      return headers;
    },
  }),
  tagTypes: ["Doctor","updateVisit"],
  endpoints: (builder) => ({
    // to login a doctor
    loginDoctor: builder.mutation<any, DoctorLoginPayload>({
      query: (doctor) => ({
        url: "/login/doctor",
        method: "POST",
        body: doctor,
      }),
    }),

    // to register a doctor
    registerDoctor: builder.mutation<any, DoctorSignupPayload>({
      query: (doctor) => ({
        url: "/register/doctor",
        method: "POST",
        body: doctor,
      }),
    }),

    // to get all doctors with optional status query param
    getDoctors: builder.query<
      DoctorsListApiResponse,
      { status?: "pending" | "approved" | "denied" }
    >({
      query: ({ status }) => ({
        url: "/doctors",
        method: "GET",
        params: status ? { status } : undefined,
      }),
      providesTags: ["Doctor"],
    }),

    // to delete a doctor
    deleteDoctor: builder.mutation<void, void>({
      query: () => ({
        url: "/doctors/me",
        method: "DELETE",
      }),
    }),

    getVerifiedDoctors: builder.query<any, void>({
      query: () => ({
        url: "/doctors?status=approved",
        method: "GET",
      }),
    }),

    // to get a doctor by id
    getDoctorById: builder.query<any, string>({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: "GET",
      }),
    }),

    getCurrentDoctor: builder.query<DoctorApiResponse, void>({
      query: () => "/doctors/me",
      providesTags: ["Doctor"],
    }),

    // Visits
    getVisitsByDoctorIdApproval: builder.query<
      any,
      { id: string; approval: "Approved" | "Denied" | "Scheduled" }
    >({
      query: ({ id, approval }) => ({
        url: `/visits?doctor_id=${id}&approval=${approval}`,
        method: "GET",
        providesTags: ["updateVisit"]
      }),
    }),

    getVisitsByDoctorId: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/visits?doctor_id=${id}`,
        method: "GET",
      }),
    }),

    approveRefuseVisit: builder.mutation<
      void,
      { visitID: string; approval: "Approved" | "Denied" }
    >({
      query: (visitPayload) => ({
        url: `/visits/${visitPayload.visitID}/approval`,
        method: "PATCH",
        body: { approval: visitPayload.approval },
      }),
    }),



    updateVisit: builder.mutation<void, { visitID: string; body: any }>({
      query: (visitPayload) => ({
        url: `/visits/${visitPayload.visitID}`,
        method: "PATCH",
        body: visitPayload.body,
        invalidatesTags: ["updateVisit"]
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(notificationsApi.util.invalidateTags(["NotificationTag"]));
        } catch {
          // Handle error if needed
        }
      },
    }),

    

    getDoctorCompletedVisits: builder.query<VisitsResponse, string>({
      query: (doctor_id: string) => ({
        url: `/visits?doctor_id=${doctor_id}&status=Completed`,
        method: "GET",
      }),
    }),

    // Patients
    getAppointedPatients: builder.query<any, string>({
      query: (id) => ({
        url: `/doctors/${id}/patients`,
        method: "GET",
      }),
    }),

    updateDoctorStatus: builder.mutation<
      any,
      { doctorId: string; status: "approved" | "denied" }
    >({
      async queryFn({ doctorId, status }, _queryApi, _extraOptions, baseQuery) {
        const doctorResponse = await baseQuery({
          url: `/doctors/${doctorId}`,
          method: "GET",
        });
        if (doctorResponse.error) {
          return { error: doctorResponse.error };
        }
        const patchResponse = await baseQuery({
          url: `/doctors/${doctorId}`,
          method: "PATCH",
          body: { status },
        });
        if (patchResponse.error) {
          return { error: patchResponse.error };
        }
        return { data: patchResponse.data };
      },
      invalidatesTags: ["Doctor"],
    }),

    // update doctor
    updateDoctor: builder.mutation<any, { body: any }>({
      query: ({ body }) => ({
        url: `/doctors/me`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Doctor"],
    }),

    getDoctorVisitPerformance: builder.query<
      any,
      { doctor_id: string; status?: string; approval?: string; new_in?: number }
    >({
      query: ({ doctor_id, status, approval, new_in }) => ({
        url: `/figures/visits`,
        method: "GET",
        params: {
          doctor_id,
          ...(status ? { status } : {}),
          ...(approval ? { approval } : {}),
          ...(new_in !== undefined ? { new_in } : {}),
        },
      }),
    }),

    giveDoctorRating: builder.mutation<
      any,
      {
        doctorId: string;
        rating: number;
        visit: string;
        patient: string;
        notificationId: string;
      }
    >({
      async queryFn(
        { doctorId, rating, visit, patient, notificationId },
        queryApi,
        _extraOptions,
        baseQuery
      ) {
        const ratingResponse = await baseQuery({
          url: `/doctors/${doctorId}/rate`,
          method: "PATCH",
          body: { rating, visit, patient },
        });

        if (ratingResponse.error) {
          return { error: ratingResponse.error };
        }

        const notificationResponse = await baseQuery({
          url: `/notifications/${notificationId}`,
          method: "PATCH",
          body: { isRead: true },
        });

        if (notificationResponse.error) {
          return { error: notificationResponse.error };
        }

        queryApi.dispatch(
          notificationsApi.util.invalidateTags(["NotificationTag"])
        );

        return { data: { ...(typeof ratingResponse.data === "object" && ratingResponse.data !== null ? ratingResponse.data : {}), notificationUpdated: true } };
      },
      invalidatesTags: ["Doctor"], 
    }),


  }),
});

export const {
  useGetDoctorsQuery,
  useLoginDoctorMutation,
  useRegisterDoctorMutation,
  useGetVerifiedDoctorsQuery,
  useDeleteDoctorMutation,
  useGetCurrentDoctorQuery,
  useGetVisitsByDoctorIdApprovalQuery,
  useApproveRefuseVisitMutation,
  useUpdateVisitMutation,
  useUpdateDoctorStatusMutation,
  useGetAppointedPatientsQuery,
  useGetVisitsByDoctorIdQuery,
  useGetDoctorByIdQuery,
  useGetDoctorCompletedVisitsQuery,
  useUpdateDoctorMutation,
  useGetDoctorVisitPerformanceQuery,
  useGiveDoctorRatingMutation,
} = doctorApi;

export const fetchDoctor = async (_id: string) => {
  try {
    // Importing store dynamically since there is circular dependency between doctorApi.ts and store.tsx
    const storeModule = await import("../store");
    const store = storeModule.default;

    const result = await store.dispatch(
      doctorApi.endpoints.getDoctorById.initiate(_id)
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

export const fetchVerifiedDoctors = async () => {
  try {
    // Importing store dynamically since there is circular dependency between doctorApi.ts and store.tsx
    const storeModule = await import("../store");
    const store = storeModule.default;

    const result = await store.dispatch(
      doctorApi.endpoints.getVerifiedDoctors.initiate()
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

export const loginDoctor = async (
  password: string,
  phone?: string,
  email?: string
) => {
  try {
    // Importing store dynamically since there is circular dependency between doctorApi.ts and store.tsx
    const storeModule = await import("../store");
    const store = storeModule.default;

    const result = await store.dispatch(
      doctorApi.endpoints.loginDoctor.initiate({
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

export const doctorApi2 = createApi({
  reducerPath: "doctorApi2",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:8000/",
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", `application/json`);
      return headers;
    },
  }),
  tagTypes: ["Doctor"],
  endpoints: (builder) => ({
    // Interaction
    drugInteraction: builder.mutation<any, InteractionPayload>({
      query: (body) => ({
        url: "/drug-interaction",
        method: "POST",
        body: body,
      }),
    }),

    // Chat
    chat: builder.mutation<any, Chat>({
      query: (body) => ({
        url: "/chat",
        method: "POST",
        body: body,
      }),
    }),
  }),
});

export const {
  useDrugInteractionMutation,
  useChatMutation
} = doctorApi2;
