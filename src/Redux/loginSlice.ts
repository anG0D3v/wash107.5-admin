import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
  admin: any[];
}

const initialState: AdminState = {
  admin: [],
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<any[]>) => {
      state.admin = action.payload;
    },
  },
});

export const { setAdmin } = adminSlice.actions;
export default adminSlice.reducer;
