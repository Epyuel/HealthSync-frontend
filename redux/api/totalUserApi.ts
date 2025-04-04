import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const totalUsersApi = createApi({
  reducerPath: "totalUsersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://healthsync-backend-bfrv.onrender.com/api",
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getAllUsers: builder.query<any, void>({
      query: () => ({
        url: "/figures/users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetAllUsersQuery } = totalUsersApi;

export const fetchAllUsers = async () => {
  try {
    const storeModule = await import("../store");
    const store = storeModule.default;
    const result = await store.dispatch(totalUsersApi.endpoints.getAllUsers.initiate());

    if ("error" in result) {
      console.error("Error fetching total users:", result.error);
      return null;
    }
    return result.data;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};