import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import { editSlice } from "./EditSlice";


export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    edit: editSlice.reducer    
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;