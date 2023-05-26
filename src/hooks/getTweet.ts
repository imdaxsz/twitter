import { TweetType } from "components/Tweet";
import { dbCollection, dbService } from "fBase";
import { onSnapshot, orderBy, query, where } from "firebase/firestore";

type getTweetFun = (setTweets: React.Dispatch<React.SetStateAction<TweetType[]>>, id?: string, filter?: string) => void;

const getTweets: getTweetFun = (setTweets, id, filter) => {
  let q;

  if (filter === "all") {
    q = query(dbCollection(dbService, "tweets"), where("mention", "==", ""), orderBy("createdAt", "desc"));
  } else if (filter === "media") {
    q = query(dbCollection(dbService, "tweets"), where("creatorId", "==", id), where("attachmentUrl", "!=", ""), orderBy("attachmentUrl"), orderBy("createdAt", "desc"));
  } else if (filter === "replies") {
    q = query(dbCollection(dbService, "tweets"), where("creatorId", "==", id), where("mention", "!=", ""), orderBy("mention"), orderBy("createdAt", "desc"));
  } else if (filter === "my") {
    q = query(dbCollection(dbService, "tweets"), where("creatorId", "==", id), where("mention", "==", ""), orderBy("createdAt", "desc"));
  } else {
    q = query(dbCollection(dbService, "tweets"), where("text", ">=", filter), where("text", "<=", filter + "\uf8ff"), orderBy("text"), orderBy("createdAt", "desc"));
  }
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

    setTweets(tweetArr);
  });
};

export default getTweets;
