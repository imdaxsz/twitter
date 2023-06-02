import { useState } from "react";
import { dbService } from "fBase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { TweetType, tweetNoti } from "types/types";

export const useToggleLike = (tweetObj: TweetType, id:string, uid: string) => {
  const [like, setLike] = useState(false);

  const toggleLike = async () => {
    if (!tweetObj.likes.includes(id)) {
      // 마음에 들어요
      await updateDoc(doc(dbService, "tweets", tweetObj.id), { likes: [...tweetObj.likes, uid] });
      setLike(true);

      // 마음 알림
      const notiRef = doc(dbService, "notification", tweetObj.creatorId);
      const docSnap = await getDoc(notiRef);
      const noti: tweetNoti = {
        uid, type:"like", tweet:tweetObj
      };
      if (docSnap.exists()) {
        await updateDoc(notiRef, { tweetNoti: [noti, ...docSnap.data().tweetNoti] });
      }
    } else {
      // 마음에 들어요 취소
      const result = tweetObj.likes.filter((id) => id !== id);
      await updateDoc(doc(dbService, "tweets", tweetObj.id), { likes: result });
      setLike(false);
    }
  };

  return { like, setLike, toggleLike };
};
