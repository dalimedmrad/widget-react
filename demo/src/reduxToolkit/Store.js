import { configureStore } from "@reduxjs/toolkit";
import DocSlice from "./docslice/DocSlice";

export const store = configureStore({
  reducer: {
    Doc: DocSlice,
  },
});
