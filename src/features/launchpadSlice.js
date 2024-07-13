// src/features/launchpadSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { set } from "lodash";

// Async thunk for collection request
export const collectionRequest = createAsyncThunk(
    "launchpad/collectionRequest",
    async (collectionData, thunkAPI) => {
        // Implement your collection request logic here
        // Return the result
    }
);

const initialState = {
    collectionRequestName: "",
    collectionRequestSymbol: "",
    collectionRequestCreator: "",
    collectionRequestDescription: "",
    collectionRequestCategory: "",
    collectionRequestSupply: 0,
    collectionRequestUriList: [],
    collectionRequestMintPrice: 0,
    collectionRequestRoyalityPerc: 0,
    collectionRequestRoyalityAddress: "",
    collectionRequestCoverImgUrl: "",
    collectionRequestBannerImgUrl: "",
    collectionRequestStartDate: "",
    collectionRequesEndDate: "",
    collectionRequestEnableFreeMint: false,
    collectionRequestEnableWl: false,
    collectionRequestEnablePresale: false,
    collectionRequestEnableAirdrop: false,
    collectionRequestPolicy: "",
    walletName: "",
    lastRequestResult: null,
    loading: false,
    error: null,
};

const launchpadSlice = createSlice({
    name: "launchpad",
    initialState,
    reducers: {
        setCollectionRequestName: (state, action) => {
            state.collectionRequestName = action.payload;
        },
        setCollectionRequestSymbol: (state, action) => {
            state.collectionRequestSymbol = action.payload;
        },
        setCollectionRequestCreator: (state, action) => {
            state.collectionRequestCreator = action.payload;
        },
        setCollectionRequestDescription: (state, action) => {
            state.collectionRequestDescription = action.payload;
        },
        setCollectionRequestCategory: (state, action) => {
            state.collectionRequestCategory = action.payload;
        },
        setCollectionRequestSupply: (state, action) => {
            state.collectionRequestSupply = action.payload;
        },
        setCollectionRequestUriList: (state, action) => {
            state.collectionRequestUriList = action.payload;
        },
        setCollectionRequestMintPrice: (state, action) => {
            state.collectionRequestMintPrice = action.payload;
        },
        setCollectionRequestRoyalityPerc: (state, action) => {
            state.collectionRequestRoyalityPerc = action.payload;
        },
        setCollectionRequestRoyalityAddress: (state, action) => {
            state.collectionRequestRoyalityAddress = action.payload;
        },
        setCollectionRequestCoverImgUrl: (state, action) => {
            state.collectionRequestCoverImgUrl = action.payload;
        },
        setCollectionRequestBannerImgUrl: (state, action) => {
            state.collectionRequestBannerImgUrl = action.payload;
        },
        setCollectionRequestStartDate: (state, action) => {
            state.collectionRequestStartDate = action.payload;
        },
        setCollectionRequesEndDate: (state, action) => {
            state.collectionRequesEndDate = action.payload;
        },
        setCollectionRequestEnableFreeMint: (state, action) => {
            state.collectionRequestEnableFreeMint = action.payload;
        },
        setCollectionRequestEnableWl: (state, action) => {
            state.collectionRequestEnableWl = action.payload;
        },
        setCollectionRequestEnablePresale: (state, action) => {
            state.collectionRequestEnablePresale = action.payload;
        },
        setCollectionRequestEnableAirdrop: (state, action) => {
            state.collectionRequestEnableAirdrop = action.payload;
        },
        setCollectionRequestPolicy: (state, action) => {
            state.collectionRequestPolicy = action.payload;
        },
        setWalletName: (state, action) => {
            state.walletName = action.payload;
        },
        setLastRequestResult: (state, action) => {
            state.lastRequestResult = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(collectionRequest.pending, (state) => {
                state.loading = true;
            })
            .addCase(collectionRequest.fulfilled, (state, action) => {
                state.loading = false;
                // Handle the successful result
            })
            .addCase(collectionRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
        // Add more cases for other async thunks
    },
});

export const {
    setCollectionRequestName,
    setCollectionRequestSymbol,
    setCollectionRequestCreator,
    setCollectionRequestDescription,
    setCollectionRequestCategory,
    setCollectionRequestSupply,
    setCollectionRequestUriList,
    setCollectionRequestMintPrice,
    setCollectionRequestRoyalityPerc,
    setCollectionRequestRoyalityAddress,
    setCollectionRequestCoverImgUrl,
    setCollectionRequestBannerImgUrl,
    setCollectionRequestStartDate,
    setCollectionRequesEndDate,
    setCollectionRequestEnableFreeMint,
    setCollectionRequestEnableWl,
    setCollectionRequestEnablePresale,
    setCollectionRequestEnableAirdrop,
    setCollectionRequestPolicy,
    setWalletName,
    setLastRequestResult,
} = launchpadSlice.actions;

export default launchpadSlice.reducer;
