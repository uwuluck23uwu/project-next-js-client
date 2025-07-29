import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.BASE_URL;

const customBaseQuery: BaseQueryFn<
  {
    url: string;
    method?: string;
    body?: any;
    headers?: Record<string, string>;
  },
  unknown,
  unknown
> = async ({ url, method = "GET", body, headers }) => {
  try {
    const res = await fetch(`${BASE_URL}/api/shirtstyle/${url}`, {
      method,
      body,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data };
    }

    return { data };
  } catch (error: any) {
    return {
      error: {
        message: error.message || "Unexpected error",
      },
    };
  }
};

export const shirtStyleApi = createApi({
  reducerPath: "shirtStyleApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getShirtStyles: builder.query({
      query: ({ pageSize = 10, currentPage = 1, search = "" }) => ({
        url: `getallshirtstyles?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`,
      }),
    }),
    getShirtStyleById: builder.query({
      query: (id) => ({ url: `getshirtstyle/${id}` }),
    }),
    createShirtStyle: builder.mutation({
      query: (formData: FormData) => ({
        url: `createshirtstyle`,
        method: "POST",
        body: formData,
      }),
    }),
    updateShirtStyle: builder.mutation({
      query: (formData: FormData) => ({
        url: `updateshirtstyle`,
        method: "POST",
        body: formData,
      }),
    }),
    deleteShirtStyles: builder.mutation({
      query: (ids: string[]) => ({
        url: `deleteshirtstyle`,
        method: "POST",
        body: JSON.stringify(ids),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useGetShirtStylesQuery,
  useGetShirtStyleByIdQuery,
  useCreateShirtStyleMutation,
  useUpdateShirtStyleMutation,
  useDeleteShirtStylesMutation,
} = shirtStyleApi;
