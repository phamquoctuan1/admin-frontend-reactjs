import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { ListParams, ListResponse, PaginationParams ,Order} from 'models';

export interface OrderState {
  loading: boolean;
  list: Order[];
  filter: ListParams;
  pagination: PaginationParams;
}

const initialState: OrderState = {
  loading: false,
  list: [],
  filter: {
    _page: 1,
    _limit: 6,
  },
  pagination: {
    _limit: 5,
    _page: 15,
    _totalRows: 15,
  },
};
const orderSlice = createSlice({
  name: 'order',
  initialState: initialState,
  reducers: {
    fetchOrderList(state, action: PayloadAction<ListParams>) {
      state.loading = true;
    },
    fetchOrderListSuccess(state, action: PayloadAction<ListResponse<Order>>) {
      state.list = action.payload.data;
      state.pagination = action.payload.pagination;
      state.loading = false;
    },
    fetchOrderListFailed(state) {
      state.loading = false;
    },
    setFilter(state, action: PayloadAction<ListParams>) {
      state.filter = action.payload;
    },
  },
});

//Actions
export const orderActions = orderSlice.actions;
//Selector
export const selectOrderFilter = (state: RootState) => state.order.filter;
export const selectOrderList = (state: RootState) => state.order.list;
export const selectOrderLoading = (state: RootState) => state.order.loading;
export const selectOrderPagination = (state: RootState) => state.order.pagination;
//Reducer
const orderReducer = orderSlice.reducer;
export default orderReducer;
