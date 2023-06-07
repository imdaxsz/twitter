import { dbService } from "fBase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { TweetType } from "types/types";
import { useState } from "react";

export const useGetTweetInfo = () => {
  const [tweet, setTweet] = useState<TweetType>();
  const [replies, setReplies] = useState<TweetType[]>([]);
  const [result, setResult] = useState(true);

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

  const getCurrentTweetInfo = async (tweetId: string) => {
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
        else setResult(false);
      });
    }
  };

  return { tweet, replies, setReplies, result, getReplies, getCurrentTweetInfo };
};
