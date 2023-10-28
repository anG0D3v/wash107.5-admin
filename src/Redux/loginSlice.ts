import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AdminInfo = {
  Address: string;
  Clien_Id: string;
  Email_Address: string;
  First_Name: string;
  Last_Name: string;
  Password: string;
  Phone_Number: string;
  Registration_Date: string;
  Role: string;
  id: string;
};
// export interface AdminState<T> {
//   admin: T | object;
// }
// const initialState: AdminState<AdminInfo> = {
//   admin: {
//     Address: '',
//     Clien_Id: '',
//     Email_Address: '',
//     First_Name: '',
//     Last_Name: '',
//     Password: '',
//     Phone_Number: '',
//     Registration_Date: '',
//     Role: '',
//     id: '',
//   },
// };

export interface AdminState {
  info: AdminInfo | null; // Change the type to AdminInfo | null
}

const initialState: AdminState = {
  info: null, // Set the initial state to null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<AdminInfo>) => {
      state.info = action.payload;
    },
  },
});

export const { setAdmin } = adminSlice.actions;
export default adminSlice.reducer;
