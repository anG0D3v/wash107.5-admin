import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderInfo } from '../types/global';

export interface OrderState {
  data: OrderInfo[] | null;
  loading: boolean;
  responseMsg: string | unknown;
}

const initialState: OrderState = {
  data: null,
  loading: false,
  responseMsg: '',
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    getOrderPending: (state) => ({
      ...state,
      loading: true,
    }),
    getOrderFulfilled: (state, act: PayloadAction<OrderInfo[]>) => ({
      ...state,
      loading: false,
      data: act.payload,
    }),
    getOrderFailed: (state, act: PayloadAction<unknown>) => ({
      ...state,
      loading: false,
      responseMsg: act.payload,
    }),
  },
});

export const { getOrderPending, getOrderFulfilled, getOrderFailed } =
orderSlice.actions;
export default orderSlice.reducer;
