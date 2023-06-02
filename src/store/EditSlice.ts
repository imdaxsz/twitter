import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TweetType } from "types/types";

interface EditingState {
  isNew: boolean;
  editModal: boolean;
  editObj: TweetType;
}

const initialState: EditingState = {
  isNew: false,
  editModal: false,
  editObj: {
    id: "",
    text: "",
    createdAt: 0,
    creatorId: "",
    creatorUid: "",
    attachmentUrl: "",
    likes: [],
    retweets: [],
    replies: [],
    mention: "",
    mentionTo: ""
  },
};

export const editSlice = createSlice({
  name: "edit", // state이름
  initialState, //state 값
  reducers: {
    setIsNew(state, action:PayloadAction<boolean>){
      state.isNew = action.payload;
    },
    setModal(state, action: PayloadAction<boolean>) {
      state.editModal = action.payload;
    },
    setEditObj(state, action: PayloadAction<TweetType>) {
      Object.assign(state.editObj, action.payload);
    },
    resetEdit(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setIsNew, setModal, setEditObj, resetEdit } = editSlice.actions;

export default editSlice.reducer;
