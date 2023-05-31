import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { addBookmarks, removeBookmarks } from "store/userSlice";
import { TweetType } from "types/types";
import { dbService } from "fBase";
import { doc, updateDoc } from "firebase/firestore";

export const useToggleBookmark = (tweetObj: TweetType, uid: string) => {
  const [bookmark, setBookmark] = useState(false);
  const bookmarkList = useSelector((state: RootState) => state.user.bookmarks);
  const dispatch = useDispatch();

  const toggleBookmark = async () => {
    if (!bookmarkList.includes(tweetObj.id)) {
      // 마음에 들어요
      await updateDoc(doc(dbService, "users", uid), { bookmarks: [...bookmarkList, tweetObj.id] });
      dispatch(addBookmarks(tweetObj.id));
      setBookmark(true);
    } else {
      // 마음에 들어요 취소
      const ok = window.confirm("트윗을 북마크에서 삭제할까요?");
      if (ok) {
        const result = bookmarkList.filter((id) => id !== tweetObj.id);
        await updateDoc(doc(dbService, "users", uid), { bookmarks: result });
        dispatch(removeBookmarks(tweetObj.id));
        setBookmark(false);
      }
    }
  };

  return { bookmark, setBookmark, toggleBookmark };
};
