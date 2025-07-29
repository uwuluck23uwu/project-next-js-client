import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.BASE_URL;

export const authenApi = createApi({
  reducerPath: "authenApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/authen`,
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUser: builder.mutation({
      query: (id) => ({
        url: `/getuser/${id}`,
        method: "GET",
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (newUser) => ({
        url: "/register",
        method: "POST",
        body: newUser,
      }),
    }),
    refreshToken: builder.mutation({
      query: (tokenDTO) => ({
        url: "/getnewtokenfromrefreshtoken",
        method: "POST",
        body: tokenDTO,
      }),
    }),
  }),
});

export const {
  useGetUserMutation,
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
} = authenApi;
