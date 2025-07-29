import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.BASE_URL;

export const branchApi = createApi({
  reducerPath: "branchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/branch`,
  }),
  endpoints: (builder) => ({
    getBranches: builder.query({
      query: ({ pageSize = 10, currentPage = 1, search = "" }) =>
        `/getallbranchs?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`,
    }),
    getBranchById: builder.query({
      query: (id) => `getbranch/${id}`,
    }),
    createBranch: builder.mutation({
      query: (newBranch) => ({
        url: `/createbranch`,
        method: "POST",
        body: newBranch,
      }),
    }),
    updateBranch: builder.mutation({
      query: (branch) => ({
        url: `/updatebranch`,
        method: "POST",
        body: branch,
      }),
    }),
    deleteBranches: builder.mutation({
      query: (ids) => ({
        url: `/deletebranch`,
        method: "POST",
        body: ids,
      }),
    }),
  }),
});

export const {
  useGetBranchesQuery,
  useGetBranchByIdQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchesMutation,
} = branchApi;
