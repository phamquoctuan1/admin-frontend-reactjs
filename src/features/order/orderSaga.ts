import { call, put } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import orderApi from 'api/orderApi';
import { ListParams, ListResponse, Order } from 'models';
import { takeLatest } from 'redux-saga/effects';
import { orderActions } from './orderSlice';

function* fetchOrderList(action: PayloadAction<ListParams>) {
  try {
    const response: ListResponse<Order> = yield call(orderApi.getAll,action.payload);
    yield put(orderActions.fetchOrderListSuccess(response));
  } catch (error:any) {
    console.log('failed to fetch order list', error?.message);
    yield put(orderActions.fetchOrderListFailed());
  }
}


export default function* orderSaga() {
  yield takeLatest(orderActions.fetchOrderList, fetchOrderList);

}
