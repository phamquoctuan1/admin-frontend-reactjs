import { call, debounce, put } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import categoryApi from 'api/categoryApi';
import { ListParams, ListResponse, Category } from 'models';
import { takeLatest } from 'redux-saga/effects';
import { categoryActions } from './categorySlice';

function* fetchCategoryList() {
  try {
    const response: ListResponse<Category> = yield call(categoryApi.getAll);
    yield put(categoryActions.fetchCategoryListSuccess(response));
  } catch (error) {
    console.log('failed to fetch student list', error);
    yield put(categoryActions.fetchCategoryListFailed());
  }
}
function* handleSearchDebounce(action: PayloadAction<ListParams>) {
  yield put(categoryActions.setFilter(action.payload));
}

export default function* categorySaga() {
  yield takeLatest(categoryActions.fetchCategoryList, fetchCategoryList);
  yield debounce(500, categoryActions.setFilterWithDebounce.type, handleSearchDebounce);
}
