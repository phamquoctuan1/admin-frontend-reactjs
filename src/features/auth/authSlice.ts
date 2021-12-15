import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { User } from 'models/user';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  logging?: boolean;
  currentUser?: User;
   error: string | undefined;
}

const initialState: AuthState = {
  isLoggedIn: false,
  logging: false,
  currentUser: undefined,
 error: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getUser(state, action: PayloadAction<string>) {
      state.logging = true;
    },
    getUserSuccess(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.isLoggedIn = true;
      state.logging = false;
      state.error = undefined;
    },
    login(state, action: PayloadAction<LoginPayload>) {
      state.logging = true;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.isLoggedIn = true;
      state.logging = false;
      state.currentUser = action.payload;
    },
    refreshToken(state, action: PayloadAction<string>) {
      state.logging = false;
    },
    loginFailed(state, action: PayloadAction<string>) {
      state.logging = false;
      state.error = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.currentUser = undefined;
    },
    clearError(state) {
      state.error = undefined;
    },
  },
});

// Actions
export const authActions = authSlice.actions;

// Selectors

export const selectUser = (state: RootState) => state.auth.currentUser;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectIsLogging = (state: RootState) => state.auth.logging;
export const selectErrorLogin = (state: RootState) => state.auth.error;
// Reducer
const authReducer = authSlice.reducer;
export default authReducer;
