import Tweet from "components/Tweet";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setCount } from "store/store";
import { useState, useEffect } from "react";
import Loading from "components/Loading";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { dbService } from "fBase";

function Likes({ uid }: { uid: string }) {
  const [loading, setLoading] = useState(true);
  const tweets = useSelector((state: RootState) => state.user.likes);
  const dispatch = useDispatch();

  useEffect(() => {
    tweets.forEach(async (a) => {
      const docRef = doc(dbService, "tweets", a.id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        const userRef = doc(dbService, "users", uid);
        const result = tweets.filter((tweet) => tweet.id !== a.id);
        await updateDoc(userRef, { likes: [...result] });
      }
    });
    setLoading(false);
    return () => {
      setLoading(true);
    };
  }, []);

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
