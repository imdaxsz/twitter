import Tweet, { TweetType } from "components/Tweet";
import { useDispatch } from "react-redux";
import { setCount } from "store/store";
import { useState, useEffect } from "react";
import Loading from "components/Loading";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { dbService } from "fBase";
import { useParams } from "react-router-dom";
import { getUserTweets } from "hooks/getTweet";

function Likes({ uid }: { uid: string }) {
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState<string[]>([]);
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    getUserTweets(setLikes, id, "likes");
    return () => {
      setLikes([]);
    };
  }, [id]);

  useEffect(() => {
    likes.forEach(async (a) => {
      const docRef = doc(dbService, "tweets", a);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        const userRef = doc(dbService, "users", uid);
        const result = likes.filter((id) => id !== a);
        await updateDoc(userRef, { likes: [...result] });
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
  }, [likes]);

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
}

export default Likes;
