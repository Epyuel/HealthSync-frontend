import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://healthsync-backend-bfrv.onrender.com/api",
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Chat", "Messages"],
  endpoints: (builder) => ({
    // Get chat by ID
    getChatById: builder.query<any, string>({
      query: (id) => ({
        url: `/chats/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Chat", id }],
    }),

    // Delete chat
    deleteChat: builder.mutation<any, string>({
      query: (id) => ({
        url: `/chats/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    // Get chat between doctor and patient
    getChatByParticipants: builder.query<
      any,
      { patientId: string; doctorId: string }
    >({
      query: ({ patientId, doctorId }) => ({
        url: `/chats/${patientId}/${doctorId}`,
        method: "GET",
      }),
      providesTags: (result) => [{ type: "Chat", id: result?.data?._id }],
    }),

    // Create a new chat
    createChat: builder.mutation<
      any,
      {
        patient: string;
        doctor: string;
        messages?: {
          sender: string;
          receiver: string;
          message: string;
          timestamp?: string;
          seen?: boolean;
        }[];
      }
    >({
      query: (chatData) => ({
        url: "/chats",
        method: "POST",
        body: chatData,
      }),
      invalidatesTags: ["Chat"],
    }),

    // Send a message in a chat
    sendMessage: builder.mutation<
      any,
      {
        chatId: string;
        sender: string;
        receiver: string;
        message: string;
        senderType: string;
        receiverType: string;
      }
    >({
      query: ({ chatId, ...messageData }) => ({
        url: `/chats/${chatId}/messages`,
        method: "POST",
        body: messageData,
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: "Messages", id: chatId },
        { type: "Chat", id: chatId },
      ],
    }),

    // Mark message as seen
    markMessageAsSeen: builder.mutation<
      any,
      { chatId: string; messageId: string }
    >({
      query: ({ chatId, messageId }) => ({
        url: `/chats/${chatId}/messages/${messageId}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: "Messages", id: chatId },
        { type: "Chat", id: chatId },
      ],
    }),

    // Get patient's doctors
    getPatientDoctors: builder.query<any, string>({
      query: (patientId) => ({
        url: `/patients/${patientId}/doctors`,
        method: "GET",
      }),
    }),

    // Get doctor's patients
    getDoctorPatients: builder.query<any, string>({
      query: (doctorId) => ({
        url: `/doctors/${doctorId}/patients`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetChatByIdQuery,
  useDeleteChatMutation,
  useGetChatByParticipantsQuery,
  useCreateChatMutation,
  useSendMessageMutation,
  useMarkMessageAsSeenMutation,
  useGetPatientDoctorsQuery,
  useGetDoctorPatientsQuery,
} = chatApi;
