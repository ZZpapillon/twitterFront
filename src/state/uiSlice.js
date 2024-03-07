import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    showSearchInput: false,
    activeProfileTab: 'posts', // Default active tab
  },
  reducers: {
    toggleSearchInput: (state) => {
      state.showSearchInput = !state.showSearchInput;
    },
    setShowSearchInput: (state, action) => {
      state.showSearchInput = action.payload;
    },
    setActiveProfileTab: (state, action) => { // New reducer for setting active profile tab
      state.activeProfileTab = action.payload;
    },
  },
});

export const { toggleSearchInput, setShowSearchInput, setActiveProfileTab } = uiSlice.actions;

export default uiSlice.reducer;