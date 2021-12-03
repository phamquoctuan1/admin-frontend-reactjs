import authSaga from 'features/auth/authSaga';
import categorySaga from 'features/category/categorySaga';

import dashboardSaga from 'features/dashboard/dashboardSaga';
import productSaga from 'features/product/productSaga';

import { all } from 'redux-saga/effects';
export default function* rootSaga() {
  yield all([authSaga(), dashboardSaga(), productSaga(), categorySaga()]);
}
