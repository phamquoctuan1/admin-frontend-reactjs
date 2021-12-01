import authSaga from 'features/auth/authSaga';

import dashboardSaga from 'features/dashboard/dashboardSaga';
import productSaga from 'features/product/productSage';

import { all } from 'redux-saga/effects';
export default function* rootSaga() {
  yield all([authSaga(), dashboardSaga(), productSaga()]);
}
