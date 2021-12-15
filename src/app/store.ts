import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import authReducer from 'features/auth/authSlice';
import categoryReducer from 'features/category/categorySlice';

import orderReducer from 'features/order/orderSlice';
import productReducer from 'features/product/productSlice';

import createSagaMiddleware from 'redux-saga';
import { history } from 'utils';
import rootSaga from './rootSaga';

const rootReducer = combineReducers({
  router: connectRouter(history),
  auth: authReducer,
  product: productReducer,
  category: categoryReducer,
  order: orderReducer
});
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware, routerMiddleware(history)),
});
sagaMiddleware.run(rootSaga);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
