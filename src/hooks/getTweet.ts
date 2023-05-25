import { TweetType } from "components/Tweet";
import { dbCollection, dbService } from "fBase";
import { onSnapshot, orderBy, query, where } from "firebase/firestore";

type getTweetFun = (setTweets: React.Dispatch<React.SetStateAction<TweetType[]>>, id: string, filter?: string) => void;

const getTweet: getTweetFun = (setTweets, id, filter) => {
  let q;
  
  if (filter === "media") {
    q = query(dbCollection(dbService, "tweets"), where("creatorId", "==", id), where("attachmentUrl", "!=", ""));
  } else q = query(dbCollection(dbService, "tweets"), where("creatorId", "==", id), orderBy("createdAt", "desc"));

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
  });
};

export default getTweet;
