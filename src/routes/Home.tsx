import { useEffect, useState } from "react";
import { dbService, dbCollection } from "fBase";
import { query, onSnapshot, orderBy } from "firebase/firestore";
import Tweet, { TweetType } from "components/Tweet";
import TweetFactory from "components/TweetFactory";
import { User } from "firebase/auth";
import TopBar from "components/TopBar";

const Home = ({ userObj }: { userObj: User | null }) => {
  const [tweets, setTweets] = useState<TweetType[]>([]);

  useEffect(() => {
    //getTweets();
    const q = query(dbCollection(dbService, "tweets"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const tweetArr: TweetType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        attachmentUrl: doc.data().attachmentUrl,
        text: doc.data().text,
        creatorId: doc.data().creatorId,
        createdAt: doc.data().createdAt,
        // ...doc.data(),
      }));
      setTweets(tweetArr);
    });
  }, []);

  return (
    <div className="container">
      <TopBar title={"홈"} userId={''} />
      <TweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj?.uid} />
        ))}
      </div>
    </div>
  );
};

export default Home;

// 새로 생성/변경된 데이터는 새로고침해야 반영되는 방식.
/*
const getTweets = async () => {
  const q = query(dbCollection(dbService, "tweets"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((document) => {
    const tweetObj = {
      ...document.data(),
      id: document.id,

    }
    setTweets(prev => [tweetObj, ...prev]);
  });
};
*/
