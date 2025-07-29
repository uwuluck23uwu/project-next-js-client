import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth.slice";
import { authenApi } from "./api/authen.api";
import { branchApi } from "./api/branch.api";
import { shirtStyleApi } from "./api/shirtstyle.api";
import { orderApi } from "./api/order.api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authenApi.reducerPath]: authenApi.reducer,
    [branchApi.reducerPath]: branchApi.reducer,
    [shirtStyleApi.reducerPath]: shirtStyleApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      authenApi.middleware,
      branchApi.middleware,
      shirtStyleApi.middleware,
      orderApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
