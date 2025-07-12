import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  PatientNotificationsResponse,
  PatientNotification,
} from "@/types/notifications";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://healthsync.weytech.et/api/api",
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", `application/json`);
      return headers;
    },
  }),
  tagTypes: ["NotificationTag"], 
  endpoints: (builder) => ({

    // Get all notifications with isRead filter
    getAllPatientNotifications: builder.query<
      PatientNotificationsResponse,
      { isRead?: boolean }
    >({
      query: ({ isRead }) => ({
        url: "/notifications?limit=1000", // Adjust limit as needed
        method: "GET",
        params: isRead !== undefined ? { isRead } : undefined,
      }),
      providesTags: ["NotificationTag"], 
    }),



    // Get notification by ID
    getNotificationById: builder.query<PatientNotification, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "GET",
      }),
      providesTags: ["NotificationTag"], 
    }),



    // Mark notification as read/unread
    updateNotificationStatus: builder.mutation<
      any,
      { id: string; isRead: boolean }
    >({
      query: ({ id, isRead }) => ({
        url: `/notifications/${id}`,
        method: "PATCH",
        body: { isRead },
      }),
      invalidatesTags: ["NotificationTag"], 
    }),

    
  }),
});

export const {
  useGetAllPatientNotificationsQuery,
  useGetNotificationByIdQuery,
  useUpdateNotificationStatusMutation,
} = notificationsApi;
