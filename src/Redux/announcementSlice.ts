import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnnouncementInfo } from '../types/global';

export interface AnnouncementState {
  data: AnnouncementInfo[] | null;
  loading: boolean;
  responseMsg: string | unknown;
}

const initialState: AnnouncementState = {
  data: null,
  loading: false,
  responseMsg: '',
};

const announcementSlice = createSlice({
  name: 'announcement',
  initialState,
  reducers: {
    getAnnouncementPending: (state) => ({
      ...state,
      loading: true,
    }),
    getAnnouncementFulfilled: (state, act: PayloadAction<AnnouncementInfo[]>) => ({
      ...state,
      loading: false,
      data: act.payload,
    }),
    getAnnouncementFailed: (state, act: PayloadAction<unknown>) => ({
      ...state,
      loading: false,
      responseMsg: act.payload,
    }),
  },
});

export const { getAnnouncementPending, getAnnouncementFulfilled, getAnnouncementFailed } =
announcementSlice.actions;
export default announcementSlice.reducer;
