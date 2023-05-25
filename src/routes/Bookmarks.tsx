import TopBar from "components/TopBar";
import Tweet from "components/Tweet";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { useEffect, useState } from "react";
import Loading from "components/Loading";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { dbService } from "fBase";

function BookMarks({ uid }: { uid: string }) {
  const [loading, setLoading] = useState(true);
  const tweets = useSelector((state: RootState) => state.user.bookmarks);

  useEffect(() => {
    tweets.forEach(async (a) => {
      const docRef = doc(dbService, "tweets", a.id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        const userRef = doc(dbService, "users", uid);
        const result = tweets.filter((tweet) => tweet.id !== a.id);
        await updateDoc(userRef, { bookmarks: [...result] });
      }
    })
    setLoading(false);
    return () => {
      setLoading(true);
    }
  }, []);

  return (
    <div className="wrapper">
      <Loading loading={loading } />
      <TopBar title={"북마크"} uid={uid} />
      <div className="container">
        <div>
          {tweets.map((tweet) => {
            return <Tweet key={tweet.id} tweetObj={tweet} uid={uid} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default BookMarks;
