import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
  isAuthenticated: boolean;
  admin: any[];
}

const initialState: AdminState = {
  isAuthenticated: false,
  admin: [],
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setAdmin: (state, action: PayloadAction<any[]>) => {
      state.admin = action.payload;
    },
  },
});

export const { setAuthenticated, setAdmin } = adminSlice.actions;
export default adminSlice.reducer;
