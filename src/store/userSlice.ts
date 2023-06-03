import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PersonType } from "types/types";

export interface UserState {
  id: string;
  name: string;
  joinDate: string;
  profileImg: string | null;
  headerImg: string | null;
  bio: string;
  myTweets: string[];
  bookmarks: string[];
  following: string[];
  followers: string[];
}

const initialState: UserState = {
  id: "",
  name: "",
  joinDate: "",
  profileImg: null,
  headerImg: null,
  bio: "",
  myTweets: [],
  bookmarks: [],
  following: [],
  followers: [],
};

export interface ProfileState {
  name: string;
  profileImg: string | null;
  headerImg: string | null;
  bio: string;
}

export const userSlice = createSlice({
  name: "user", // state이름
  initialState, //state 값
  reducers: {
    reset(state) {
      Object.assign(state, initialState);
    },
    initUser(state, action: PayloadAction<UserState>) {
      Object.assign(state, action.payload);
    },
    changeProfile(state, action: PayloadAction<ProfileState>) {
      state.name = action.payload.name;
      state.bio = action.payload.bio;
      state.profileImg = action.payload.profileImg;
      state.headerImg = action.payload.headerImg;
    },
    setBookmarks(state, action: PayloadAction<string[]>) {
      Object.assign(state, action.payload);
    },
    setMyTweets(state, action: PayloadAction<string[]>) {
      Object.assign(state, action.payload);
    },
    setRetweets(state, action: PayloadAction<string[]>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { reset, initUser, changeProfile, setBookmarks, setMyTweets, setRetweets } = userSlice.actions;

export default userSlice.reducer;
