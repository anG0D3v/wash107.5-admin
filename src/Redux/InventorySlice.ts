import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { inventoryList } from '../types/global';

export interface InventoryState {
  data: inventoryList[] | null;
  loading: boolean;
  responseMsg: string | unknown;
}

const initialState: InventoryState = {
  data: null,
  loading: false,
  responseMsg: '',
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    getInventoryPending: (state) => ({
      ...state,
      loading: true,
    }),
    getInventoryFulfilled: (state, act: PayloadAction<inventoryList[]>) => ({
      ...state,
      loading: false,
      data: act.payload,
    }),
    getInventoryFailed: (state, act: PayloadAction<unknown>) => ({
      ...state,
      loading: false,
      responseMsg: act.payload,
    }),
  },
});

export const { getInventoryPending, getInventoryFulfilled, getInventoryFailed } =
inventorySlice.actions;
export default inventorySlice.reducer;
