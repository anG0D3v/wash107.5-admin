import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '../types/global';

// export interface AdminState<T> {
//   admin: T | object;
// }
// const initialState: AdminState<UserInfo> = {
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
  info: UserInfo | null; // Change the type to UserInfo | null
}

const initialState: AdminState = {
  info: null, // Set the initial state to null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<UserInfo>) => {
      state.info = action.payload;
    },
    signOut: (state) => ({
      ...state,
      info: null,
    }),
  },
});

export const { setAdmin, signOut } = adminSlice.actions;
export default adminSlice.reducer;
