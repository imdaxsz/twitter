import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PersonType } from "types/types";
import { TweetType } from "types/types";

export interface UserState {
  id: string;
  name: string;
  joinDate: string;
  profileImg: string | null;
  headerImg: string | null;
  bio: string;
  myTweets: string[];
  retweets: string[];
  likes: TweetType[];
  bookmarks: string[];
  following: PersonType[];
  followers: PersonType[];
}

const initialState: UserState = {
  id: "",
  name: "",
  joinDate: "",
  profileImg: null,
  headerImg: null,
  bio: "",
  myTweets: [],
  retweets: [],
  likes: [],
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
    changeProfileImg(state, action: PayloadAction<string>) {
      state.profileImg = action.payload;
    },
    addBookmarks(state, action: PayloadAction<string>) {
      state.bookmarks.push(action.payload);
    },
    removeBookmarks(state, action: PayloadAction<string>) {
      state.bookmarks = state.bookmarks.filter((id) => id !== action.payload);
    },
    addLikes(state, action: PayloadAction<TweetType>) {
      state.likes.push(action.payload);
    },
    removeLikes(state, action: PayloadAction<string>) {
      state.likes = state.likes.filter((a) => a.id !== action.payload);
    },
    removeMyTweets(state, action: PayloadAction<string>) {
      state.myTweets = state.myTweets.filter((id) => id !== action.payload);
    },
    removeRetweets(state, action: PayloadAction<string>) {
      state.retweets = state.retweets.filter((id) => id !== action.payload);
    },
    addFollower(state, action: PayloadAction<PersonType>) {
      state.followers.push(action.payload);
    },
    removeFollower(state, action: PayloadAction<string>) {
      state.followers = state.followers.filter((follow) => follow.id !== action.payload);
    },
    addFollowing(state, action: PayloadAction<PersonType>) {
      state.following.push(action.payload);
    },
    removeFollowing(state, action: PayloadAction<string>) {
      state.following = state.following.filter((follow) => follow.id !== action.payload);
    },
  },
});

export const { reset, initUser, changeProfile, changeProfileImg, addBookmarks, removeBookmarks, addLikes, removeLikes, removeMyTweets, removeRetweets, addFollower, removeFollower, addFollowing, removeFollowing } = userSlice.actions;

export default userSlice.reducer;
