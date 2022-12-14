import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { authSlice } from 'features/auth';
import { notificationSlice } from 'features/notifications';
import { rootApi } from 'lib/rootApi';

export const rootReducer = combineReducers({
  [rootApi.reducerPath]: rootApi.reducer,
  [authSlice.name]: authSlice.reducer,
  [notificationSlice.name]: notificationSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rootApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
