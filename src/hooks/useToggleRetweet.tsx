import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { setMyTweets } from "store/userSlice";
import { TweetType, TweetNoti } from "types/types";
import { dbService } from "fBase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const useToggleRetweet = (tweetObj: TweetType, id: string, uid: string) => {
  const [retweet, setRetweet] = useState(false);
  const { myTweets } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const toggleRetweet = async () => {
    if (!tweetObj.retweets.includes(id)) {
      // 리트윗
      await updateDoc(doc(dbService, "users", uid), { myTweets: [tweetObj.id, ...myTweets] });
      dispatch(setMyTweets([tweetObj.id, ...myTweets]));
      await updateDoc(doc(dbService, "tweets", tweetObj.id), { retweets: [id, ...tweetObj.retweets] });
      setRetweet(true);

      // 리트윗 알림
      const notiRef = doc(dbService, "notifications", tweetObj.creatorId);
      const docSnap = await getDoc(notiRef);
      const noti: TweetNoti = {
        uid,
        type: "retweet",
        tweet: tweetObj,
      };
      if (docSnap.exists()) {
        await updateDoc(notiRef, { tweetNoti: [noti, ...docSnap.data().tweetNoti] });
      }
    } else {
      // 리트윗 취소
      let result: string[] = [...myTweets];
      // 내가 작성한 트윗의 RT를 취소할 경우 원 트윗은 삭제되지 않도록 함
      for (let i = 0; i < result.length; i++) {
        if (result[i] === tweetObj.id) {
          result.splice(i, 1);
          break;
        }
      }
      await updateDoc(doc(dbService, "users", uid), { myTweets: result });
      dispatch(setMyTweets(result));
      const list = tweetObj.retweets.filter((id) => id !== id);
      await updateDoc(doc(dbService, "tweets", tweetObj.id), { retweets: list });
      setRetweet(false);
    }
  };

  return { retweet, setRetweet, toggleRetweet };
};
