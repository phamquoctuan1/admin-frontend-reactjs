import { call, delay, fork, put, take } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import authApi from 'api/authApi';
import { push } from 'connected-react-router';
import { User, UserRespone } from 'models';
import { authActions, LoginPayload } from './authSlice';

function* handleLogin(payload: LoginPayload) {
  try {
    yield delay(1000);
    const resToken: UserRespone = yield call(authApi.login, payload);
    if (resToken) {
      localStorage.setItem(
        'access_token',
        JSON.stringify(resToken.accessToken)
      );
      localStorage.setItem(
        'refresh_token',
        JSON.stringify(resToken.refreshToken)
      );
      const resUser: User = yield call(authApi.getUser, resToken.accessToken);
      yield put(authActions.getUserSuccess(resUser));
      yield put(authActions.loginSuccess(resUser));
    localStorage.setItem('access_token', JSON.stringify(payload));
    yield put(push('/admin/dashboard'));
      }
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
