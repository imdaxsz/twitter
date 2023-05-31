import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCount } from "store/store";
import { getUserTweets } from "utils/getTweet";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { dbService } from "fBase";
import Tweet from "components/Tweet";
import Loading from "components/Loading";
import { TweetType } from "types/types";

const DefaultTweets = ({ uid }: { uid: string }) => {
  const [loading, setLoading] = useState(true);
  const [userTweets, setUserTweets] = useState<string[]>([]);
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    getUserTweets(setUserTweets, id, "default");
    return () => {
      setUserTweets([]);
    };
  }, [id]);

  useEffect(() => {
    userTweets.forEach(async (a) => {
      const docRef = doc(dbService, "tweets", a);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        const userRef = doc(dbService, "users", uid);
        const result = userTweets.filter((id) => id !== a);
        await updateDoc(userRef, { myTweets: [...result] });
      } else {
        const tweetObj: TweetType = {
          id: docSnap.id,
          attachmentUrl: docSnap.data().attachmentUrl,
          text: docSnap.data().text,
          creatorId: docSnap.data().creatorId,
          creatorUid: docSnap.data().creatorUid,
          createdAt: docSnap.data().createdAt,
          likes: docSnap.data().likes,
          retweets: docSnap.data().retweets,
          replies: docSnap.data().replies,
          mention: docSnap.data().mention,
          mentionTo: docSnap.data().mentionTo,
        };
        setTweets((prev) => [tweetObj, ...prev]);
      }
    });
    setLoading(false);
    return () => {
      setTweets([]);
      setLoading(true);
    };
  }, [userTweets]);

  useEffect(() => {
    dispatch(setCount(tweets.length));
  }, [tweets]);

  return (
    <div>
      <Loading loading={loading} />
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweetObj={tweet} uid={uid} />
      ))}
    </div>
  );
};

export default DefaultTweets;
