import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '../types/global';

export interface UserState {
  data: UserInfo[] | null;
  loading: boolean;
  responseMsg: string | unknown;
}

const initialState: UserState = {
  data: null,
  loading: false,
  responseMsg: '',
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getUsersPending: (state) => ({
      ...state,
      loading: true,
    }),
    getUsersFulfilled: (state, act: PayloadAction<UserInfo[]>) => ({
      ...state,
      loading: false,
      data: act.payload,
    }),
    getUsersFailed: (state, act: PayloadAction<unknown>) => ({
      ...state,
      loading: false,
      responseMsg: act.payload,
    }),
  },
});

export const { getUsersPending, getUsersFulfilled, getUsersFailed } =
  userSlice.actions;
export default userSlice.reducer;
