import { call, put } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import shipmentApi from 'api/shipmentApi';
import { ListParams, ListResponse, Shipment } from 'models';
import { takeLatest } from 'redux-saga/effects';
import { shipmentActions } from './shipmentSlice';

function* fetchOrderList(action: PayloadAction<ListParams>) {
  try {
    const response: ListResponse<Shipment> = yield call(shipmentApi.getAll,action.payload);
    yield put(shipmentActions.fetchShipmentListSuccess(response));
  } catch (error:any) {
    console.log('failed to fetch shipment list', error?.message);
    yield put(shipmentActions.fetchShipmentListFailed());
  }
}


export default function* orderSaga() {
  yield takeLatest(shipmentActions.fetchShipmentList, fetchOrderList);

}
