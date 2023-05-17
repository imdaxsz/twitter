import { useEffect, useState } from "react";
import { dbService, dbCollection, auth } from "fBase";
import { query, onSnapshot, orderBy } from "firebase/firestore";
import Tweet, { TweetType } from "components/Tweet";
import TweetFactory from "components/TweetFactory";
import TopBar from "components/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { changeProfileImg } from "store/userSlice";

const Home = ({uid}:{uid:string}) => {
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const test = auth.currentUser;

  useEffect(() => {
    if (test && test.providerData[0].providerId === "google.com") {
      if (test.providerData[0].photoURL) dispatch(changeProfileImg(test.providerData[0].photoURL));
    }

    const q = query(dbCollection(dbService, "tweets"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const tweetArr: TweetType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        attachmentUrl: doc.data().attachmentUrl,
        text: doc.data().text,
        creatorId: doc.data().creatorId,
        creatorUid: doc.data().creatorUid,
        creatorName: doc.data().creatorName,
        createdAt: doc.data().createdAt,
        likes: doc.data().likes,
        retweets: doc.data().retweets,
        replies: doc.data().replies,
      }));

      setTweets(tweetArr);
    });
  }, []);

  return (
    <div className="wrapper">
      <TopBar title={"홈"} uid={uid} />
      <div className="container">
        <TweetFactory uid={uid} />
        <div>
          {tweets.map((tweet) => (
            <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorUid === uid} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;