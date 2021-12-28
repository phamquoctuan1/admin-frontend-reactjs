import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { ListParams, ListResponse, PaginationParams, Shipment } from 'models';

export interface ShipmentState {
  loading: boolean;
  list: Shipment[];
  filter: ListParams;
  pagination: PaginationParams;
}

const initialState: ShipmentState = {
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
const shipmentSlice = createSlice({
  name: 'shipment',
  initialState: initialState,
  reducers: {
    fetchShipmentList(state, action: PayloadAction<ListParams>) {
      state.loading = true;
    },
    fetchShipmentListSuccess(state, action: PayloadAction<ListResponse<Shipment>>) {
      state.list = action.payload.data;
      state.pagination = action.payload.pagination;
      state.loading = false;
    },
    fetchShipmentListFailed(state) {
      state.loading = false;
    },
    setFilter(state, action: PayloadAction<ListParams>) {
      state.filter = action.payload;
    },
  },
});

//Actions
export const shipmentActions = shipmentSlice.actions;
//Selector
export const selectShipmentFilter = (state: RootState) => state.shipment.filter;
export const selectShipmentList = (state: RootState) => state.shipment.list;
export const selectShipmentLoading = (state: RootState) => state.shipment.loading;
export const selectShipmentPagination = (state: RootState) => state.shipment.pagination;
//Reducer
const shipmentReducer = shipmentSlice.reducer;
export default shipmentReducer;
