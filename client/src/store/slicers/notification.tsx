import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: "",
  title: "",
  message: "",
  show: false,
};

export interface INotificationsProps {
  type: "success" | "danger" | "error";
  title: string;
  message: string;
  show?: boolean;
}

const notificationSlice = createSlice({
  reducers: {
    changeValue: (state: any, action: { payload: INotificationsProps }) => {
      const { title, message, type } = action.payload;
      state.type = type;
      state.title = title;
      state.message = message;
      state.show = true;
    },
    clearValue: (state: any) => {
      state.type = "";
      state.title = "";
      state.message = "";
      state.show = false;
    },
  },
  name: "notification",
  initialState: initialState,
});

export const { changeValue, clearValue } = notificationSlice.actions;

export default notificationSlice.reducer;
