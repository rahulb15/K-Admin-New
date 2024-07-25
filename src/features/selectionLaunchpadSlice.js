import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    selection: null,
}

export const selectionLaunchpadSlice = createSlice({
    name: 'selectionLaunchpad',
    initialState,
    reducers: {
        setSelection: (state, action) => {
            state.selection = action.payload
        }
    }
})

export const { setSelection } = selectionLaunchpadSlice.actions

export default selectionLaunchpadSlice.reducer

