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
    const res = await fetch(`${BASE_URL}/api/order/${url}`, {
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

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ pageSize = 10, currentPage = 1, search = "" }) => ({
        url: `getallorders?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`,
      }),
    }),
    getOrderById: builder.query({
      query: (id: string) => ({
        url: `getorder/${id}`,
      }),
    }),
    createOrder: builder.mutation({
      query: (formData: FormData) => ({
        url: `createorder`,
        method: "POST",
        body: formData,
      }),
    }),
    updateOrder: builder.mutation({
      query: (formData: FormData) => ({
        url: `updateorder`,
        method: "POST",
        body: formData,
      }),
    }),
    deleteOrders: builder.mutation({
      query: (ids: string[]) => ({
        url: `deleteorder`,
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
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrdersMutation,
} = orderApi;
