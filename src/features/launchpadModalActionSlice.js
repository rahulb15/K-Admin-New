import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isModalOpen: false,
}

export const launchpadModalActionSlice = createSlice({
    name: 'launchpadModalAction',
    initialState,
    reducers: {
        setModalOpen: (state, action) => {
            state.isModalOpen = action.payload
        }
    }
})

export const { setModalOpen } = launchpadModalActionSlice.actions

export default launchpadModalActionSlice.reducer