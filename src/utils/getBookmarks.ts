import { TweetType } from "types/types";
import { dbCollection, dbService } from "fBase";
import { onSnapshot, query } from "firebase/firestore";

type BookMarksFunType = (setTweets: React.Dispatch<React.SetStateAction<TweetType[]>>, bookmarks: string[]) => void;

export const getBookmarks:BookMarksFunType = (setTweets, bookmarks) => {
  const q = query(dbCollection(dbService, "tweets"));
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
      mention: doc.data().mention,
      mentionTo: doc.data().mentionTo,
    }));
    const result = tweetArr.filter((tweet) => bookmarks.includes(tweet.id));
    setTweets(result);
  });
};
