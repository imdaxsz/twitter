import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TweetType } from "components/Tweet";

export interface UserState {
  id: string;
  name: string;
  joinDate: string;
  profileImg: string | null;
  headerImg: string | null;
  bio: string;
  likes: string[];
  bookmarks: TweetType[];
  following: string[];
  follower: string[];
}

const initialState: UserState = {
  id: "",
  name: "",
  joinDate: "",
  profileImg: null,
  headerImg: null,
  bio: "",
  likes: [],
  bookmarks: [],
  following: [],
  follower: [],
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
    // setId(state, action: PayloadAction<string>) {
    //   state.id = action.payload;
    // },
    // setJoinDate(state, action: PayloadAction<string>) {
    //   state.id = action.payload;
    // },
    changeProfile(state, action: PayloadAction<ProfileState>) {
      state.name = action.payload.name;
      state.bio = action.payload.bio;
      state.profileImg = action.payload.profileImg;
      state.headerImg = action.payload.headerImg;
    },
    changeProfileImg(state, action: PayloadAction<string>) {
      state.profileImg = action.payload;
    },
    addBookmarks(state, action: PayloadAction<TweetType>) {
      state.bookmarks.push(action.payload);
    },
    removeBookmarks(state, action: PayloadAction<string>) {
      state.bookmarks = state.bookmarks.filter((tweet) => tweet.id !== action.payload);
    },
    addLikes(state, action: PayloadAction<string>) {
      state.likes.push(action.payload);
    },
    removeLikes(state, action: PayloadAction<string>) {
      state.likes = state.likes.filter((id) => id !== action.payload);
    },
    addFollower(state, action: PayloadAction<string>) {
      state.follower.push(action.payload);
    },
    removeFollower(state, action: PayloadAction<string>) {
      state.follower = state.follower.filter((id) => id !== action.payload);
    },
    addFollowing(state, action: PayloadAction<string>) {
      state.following.push(action.payload);
    },
    removeFollowing(state, action: PayloadAction<string>) {
      state.following = state.following.filter((id) => id !== action.payload);
    },
  },
});

export const { reset, initUser, changeProfile, changeProfileImg, addBookmarks, removeBookmarks, addLikes, removeLikes, addFollower, removeFollower, addFollowing, removeFollowing } = userSlice.actions;

export default userSlice.reducer;
