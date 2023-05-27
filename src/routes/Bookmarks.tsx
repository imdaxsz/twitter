import TopBar from "components/TopBar";
import Tweet, { TweetType } from "components/Tweet";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { useEffect, useState } from "react";
import Loading from "components/Loading";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { dbService } from "fBase";
import { getUserTweets } from "hooks/getTweet";

function BookMarks({ uid }: { uid: string }) {
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const { id } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    getUserTweets(setBookmarks, id, "bookmarks");
    return () => {
      setBookmarks([]);
    };
  }, []);

  useEffect(() => {
    bookmarks.forEach(async (a) => {
      const docRef = doc(dbService, "tweets", a);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        const userRef = doc(dbService, "users", uid);
        const result = bookmarks.filter((id) => id !== a);
        await updateDoc(userRef, { bookmarks: [...result] });
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
  }, [bookmarks]);

  return (
    <div className="wrapper">
      <Loading loading={loading} />
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
