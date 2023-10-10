import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const mainSlice = createSlice({
  reducers: {
    changeValue: (state: any, action: any) => {
      state.value = action.payload;
    },
  },
  name: "main",
  initialState: initialState,
});

export const { changeValue } = mainSlice.actions;

export default mainSlice.reducer;
