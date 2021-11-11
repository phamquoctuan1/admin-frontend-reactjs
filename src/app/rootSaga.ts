import authSaga from 'features/auth/authSaga';
import citySaga from 'features/city/citySaga';
import dashboardSaga from 'features/dashboard/dashboardSaga';
import productSaga from 'features/product/productSage';
import studentSaga from 'features/student/studentSaga';
import { all } from 'redux-saga/effects';
export default function* rootSaga() {
  yield all([authSaga(), dashboardSaga(), studentSaga(), citySaga(), productSaga()]);
}
