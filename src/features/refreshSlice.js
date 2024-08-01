import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isRefresh: false,
}

export const refreshSlice = createSlice({
    name: 'refresh',
    initialState,
    reducers: {
        setRefresh: (state, action) => {
            state.isRefresh = action.payload
        }
    }
})

export const { setRefresh } = refreshSlice.actions

export default refreshSlice.reducer