import { useState } from "react";
import { dbService } from "fBase";
import { doc, updateDoc } from "firebase/firestore";
import { TweetType } from "types/types";

export const useToggleLike = (tweetObj: TweetType, uid:string) => {
  const [like, setLike] = useState(false);

  const toggleLike = async () => {
    if (!tweetObj.likes.includes(uid)) {
      // 마음에 들어요
      await updateDoc(doc(dbService, "tweets", tweetObj.id), { likes: [...tweetObj.likes, uid] });
      setLike(true);
    } else {
      // 마음에 들어요 취소
      const result = tweetObj.likes.filter((id) => id !== uid);
      await updateDoc(doc(dbService, "tweets", tweetObj.id), { likes: result });
      setLike(false);
    }
  };

  return { like, setLike, toggleLike };
};
