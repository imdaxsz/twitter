import { useEffect, useState } from "react";
import { dbService, dbCollection } from "fBase";
import { query, onSnapshot, orderBy } from "firebase/firestore";
import Tweet, { TweetType } from "components/Tweet";
import TweetFactory from "components/TweetFactory";
import TopBar from "components/TopBar";
import Loading from "components/Loading";
import TweetModal from "components/TweetModal";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

const Home = ({ uid }: { uid: string }) => {
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const [loading, setLoading] = useState(true);
  const edit = useSelector((state: RootState) => state.edit);

  useEffect(() => {
    const q = query(dbCollection(dbService, "tweets"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const tweetArr: TweetType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        attachmentUrl: doc.data().attachmentUrl,
        text: doc.data().text,
        creatorId: doc.data().creatorId,
        creatorUid: doc.data().creatorUid,
        createdAt: doc.data().createdAt,
        likes: doc.data().likes,
        retweets: doc.data().retweets,
        replies: doc.data().replies,
      }));

      setTweets(tweetArr);
      setLoading(false);
    });

    return () => {
      setLoading(true);
    };
  }, []);

  return (
    <>
      {edit.editModal && edit.editObj.id !== "" && <TweetModal uid={uid} />}
      <div className="wrapper">
        <Loading loading={loading} />
        <TopBar title={"홈"} uid={uid} />
        <div className="container">
          <TweetFactory uid={uid} />
          <div>
            {tweets.map((tweet) => (
              <Tweet key={tweet.id} tweetObj={tweet} uid={uid} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
