import { call, delay, fork, put, take, spawn } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import authApi from 'api/authApi';
import { AxiosError } from 'axios';
import { push } from 'connected-react-router';
import { User, UserRespone } from 'models';
import { authActions, LoginPayload } from './authSlice';

function* handleLogin(payload: LoginPayload) {
  try {
    const resToken: UserRespone = yield call(authApi.login, payload);
    if(resToken)
      localStorage.setItem('access_token', JSON.stringify(resToken.accessToken));
      const resUser: User = yield call(authApi.getUser, resToken.accessToken);
      yield put(authActions.getUserSuccess(resUser));
      yield put(authActions.loginSuccess(resUser));
      yield put(push('/admin'));
  } catch (error) {
    let msg = (error as AxiosError).response?.data.message;
    yield put(authActions.loginFailed(msg));
  }
}

function* getUser(payload: string) {
  const resUser: User = yield call(authApi.getUser, payload);
  if (resUser) yield put(authActions.getUserSuccess(resUser));
  else {
    yield fork(handleLogout);
  }
}

function* handleLogout() {
  yield delay(1000);
  localStorage.removeItem('access_token');
  yield put(push('/login'));
}


function* watchGetUser() {
  const isLoggedIn = Boolean(localStorage.getItem('access_token'));
  if (isLoggedIn) {
    const action: PayloadAction<string> = yield take(authActions.getUser.type);
    yield fork(getUser, action.payload);
  }
}
function* watchLoginFlow() {
  while (true) {
    const isLoggedIn = Boolean(localStorage.getItem('access_token'));
    if (!isLoggedIn) {
      const action: PayloadAction<LoginPayload> = yield take(authActions.login.type);
      yield fork(handleLogin, action.payload);
    } else {
      yield take(authActions.logout.type);
      yield fork(handleLogout);
    }
    yield delay(1000);
  }
}

export default function* authSaga() {
  yield fork(watchLoginFlow);
   yield spawn(watchGetUser);
}
