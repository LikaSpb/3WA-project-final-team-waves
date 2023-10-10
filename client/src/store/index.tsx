import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import mainSlice from "./slicers/main";
import notificationSlice from "./slicers/notification";
import userSlice from "./slicers/user";

export const store = configureStore({
  reducer: {
    main: mainSlice,
    notifications: notificationSlice,
    user: userSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
