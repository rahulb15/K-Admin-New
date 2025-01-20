// services/freeMint.service.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const freeMintApi = createApi({
  reducerPath: 'freeMintApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['FreeMint'],
  endpoints: (builder) => ({
    createFreeMintLocal: builder.mutation({
      query: (data) => ({
        url: '/freemint/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FreeMint'],
    }),

    updateAllowUsers: builder.mutation({
      query: (data) => ({
        url: '/freemint/updateAllowUsers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FreeMint'],
    }),

    addUsers: builder.mutation({
      query: (data) => ({
        url: '/freemint/addUsers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FreeMint'],
    }),

    markClaimed: builder.mutation({
      query: (data) => ({
        url: '/freemint/markClaimed',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FreeMint'],
    }),

    cancelFreeMint: builder.mutation({
      query: (data) => ({
        url: '/freemint/cancel',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FreeMint'],
    }),

    getClaimStatus: builder.query({
      query: ({ collectionName, kAddress }) => 
        `/freemint/claimStatus?collectionName=${collectionName}&kAddress=${kAddress}`,
      providesTags: ['FreeMint'],
    }),

    getFreeMintEnabled: builder.query({
      query: (collectionName) => `/freemint/enabled/${collectionName}`,
      providesTags: ['FreeMint'],
    }),

    getFreeMintClaim: builder.query({
      query: ({ collectionName, account }) => 
        `/freemint/claim?collectionName=${collectionName}&account=${account}`,
      providesTags: ['FreeMint'],
    }),

    getFreeMintTotalSupply: builder.query({
      query: (collectionName) => `/freemint/totalSupply/${collectionName}`,
      providesTags: ['FreeMint'],
    }),

    getFreeMintUsers: builder.query({
      query: (collectionName) => `/freemint/users/${collectionName}`,
      providesTags: ['FreeMint'],
    }),

    getAllowUserStatus: builder.query({
      query: (collectionName) => `/freemint/allowUserStatus/${collectionName}`,
      providesTags: ['FreeMint'],
    }),


    isFreeMintActive: builder.query({
      query: (collectionName) => `/freemint/active/${collectionName}`,
      providesTags: ['FreeMint'],
    }),
  }),
});

export const {
  useCreateFreeMintLocalMutation,
  useUpdateAllowUsersMutation,
  useAddUsersMutation,
  useMarkClaimedMutation,
  useCancelFreeMintMutation,
  useGetClaimStatusQuery,
  useGetFreeMintEnabledQuery,
  useGetFreeMintClaimQuery,
  useGetFreeMintTotalSupplyQuery,
  useGetFreeMintUsersQuery,
  useGetAllowUserStatusQuery,
  useIsFreeMintActiveQuery,
} = freeMintApi;