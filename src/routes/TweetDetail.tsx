import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { dbService } from "fBase";
import TopBar from "components/TopBar";
import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";
import { TweetType } from "types/types";

const TweetDetail = ({ uid }: { uid: string }) => {
  const { tweetId } = useParams();
  const [tweet, setTweet] = useState<TweetType>();
  const [replies, setReplies] = useState<TweetType[]>([]);

  const getReplies = () => {
    if (tweet && tweet.replies.length > 0) {
      tweet.replies.forEach(async (i) => {
        const replySnap = await getDoc(doc(dbService, "tweets", i));
        if (replySnap.exists()) {
          const replyObj: TweetType = {
            id: replySnap.id,
            attachmentUrl: replySnap.data().attachmentUrl,
            text: replySnap.data().text,
            creatorId: replySnap.data().creatorId,
            creatorUid: replySnap.data().creatorUid,
            createdAt: replySnap.data().createdAt,
            likes: replySnap.data().likes,
            retweets: replySnap.data().retweets,
            replies: replySnap.data().replies,
            mention: replySnap.data().mention,
            mentionTo: replySnap.data().mentionTo,
          };
          setReplies((prev) => [...prev, replyObj]);
        }
      });
    }
  };

  const getTweetInfo = async (tweetId: string) => {
    if (typeof tweetId === "string") {
      onSnapshot(doc(dbService, "tweets", tweetId), (doc) => {
        if (doc.exists()) {
          const tweetObj: TweetType = {
            id: doc.id,
            attachmentUrl: doc.data().attachmentUrl,
            text: doc.data().text,
            creatorId: doc.data().creatorId,
            creatorUid: doc.data().creatorUid,
            createdAt: doc.data().createdAt,
            likes: doc.data().likes,
            retweets: doc.data().retweets,
            replies: doc.data().replies,
            mention: doc.data().mention,
            mentionTo: doc.data().mentionTo,
          };
          setTweet(tweetObj);
        }
      });
    }
  };

  useEffect(() => {
    if (tweetId) {
      getTweetInfo(tweetId);
    }
  }, [tweetId]);

  useEffect(() => {
    getReplies();
    return () => {
      setReplies([]);
    };
  }, [tweet?.replies.length]);

  return (
    <div className="wrapper">
      <TopBar title="트윗" uid={uid} />
      <div className="container">
        {typeof tweet !== "undefined" && (
          <>
            <Tweet tweetObj={tweet} uid={uid} detail={true} />
            <TweetFactory uid={uid} mention={tweet.id} mentionTo={tweet.creatorId} />
            {tweet.replies.length > 0 && (
              <>
                {replies.map((tweet) => (
                  <Tweet key={tweet.id} tweetObj={tweet} uid={uid} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TweetDetail;
