import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import { editSlice } from "./EditSlice";

interface CountState {
  value: number;
};

const initialState:CountState = { value: 0 };

const tweetCountSlice = createSlice({
  name: 'tweetCount',
  initialState,
  reducers: {
    setCount(state, action: PayloadAction<number>) {
      state.value = action.payload;
    }
  }
})

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    edit: editSlice.reducer,
    tweetCount: tweetCountSlice.reducer,
  }
});

export const { setCount } = tweetCountSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;