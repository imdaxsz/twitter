import TopBar from "components/TopBar";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Tweet, { TweetType } from "components/Tweet";
import { doc, getDoc } from "firebase/firestore";
import { dbService } from "fBase";
import TweetFactory from "components/TweetFactory";

const TweetDetail = ({ uid }: { uid: string }) => {
  const { tweetId } = useParams();
  const [tweet, setTweet] = useState<TweetType>();
  // const [more, setMore] = useState(false);

  const getCurrentTweet = async () => {
    if (typeof tweetId === "string") {
      const docRef = doc(dbService, "tweets", tweetId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
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
        };
        setTweet(tweetObj);
      }
    }
  };

  useEffect(() => {
    getCurrentTweet();
  }, [tweet]);

  return (
    <div className="wrapper">
      <TopBar title="트윗" uid={uid} />
      <div className="container">
        {typeof tweet !== "undefined" && (
          <Tweet tweetObj={tweet} uid={uid} detail={true} />
        )}
        <TweetFactory uid={uid} reply={true} />
      </div>
    </div>
  );
};

export default TweetDetail;
