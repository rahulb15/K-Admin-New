// src/features/searchSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isSearchFocused: false
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchFocus: (state, action) => {
      state.isSearchFocused = action.payload
    }
  }
})

export const { setSearchFocus } = searchSlice.actions

export default searchSlice.reducer