import { call, delay, fork, put, take } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { authActions, LoginPayload } from './authSlice';

function* handleLogin(payload: LoginPayload) {
  try {
    yield delay(1000);
    //   yield call(userAPI, payload)
    localStorage.setItem('access_token', JSON.stringify(payload));
    yield put(
      authActions.loginSuccess({
        id: 1,
        name: 'Pham Tuan',
      })
    );
    yield put(push('/admin/dashboard'));
  } catch (error: unknown) {
    yield put(authActions.loginFailed('error'));
  }
}

function* handleLogout() {
  yield delay(1000);
  localStorage.removeItem('access_token');
  yield put(push('/login'));
}

function* watchLoginFlow() {
  while (true) {
    const isLoggedIn = Boolean(localStorage.getItem('access_token'));
    if (!isLoggedIn) {
      const action: PayloadAction<LoginPayload> = yield take(authActions.login.type);
      yield fork(handleLogin, action.payload);
    }
    yield take(authActions.logout.type);
    yield call(handleLogout);
  }
}

export default function* authSaga() {
  yield fork(watchLoginFlow);
}
