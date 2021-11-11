import { call, put, takeLatest } from '@redux-saga/core/effects';
import cityApi from 'api/cityApi';
import { City, ListResponse } from 'models';
import { cityActions } from './citySlice';

function* fetchCityList() {
  try {
    const response: ListResponse<City> = yield call(cityApi.getAll);
    yield put(cityActions.fetchCityListSuccess(response));
  } catch (error) {
    console.log('failed to fetch city list', error);
    yield put(cityActions.fetchCityListFailed());
  }
}

export default function* citySaga() {
  yield takeLatest(cityActions.fetchCityList.type, fetchCityList);
}
