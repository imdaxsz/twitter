import { TweetType } from "types/types";
import { dbCollection, dbService } from "fBase";
import { getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";

type getTweetFun = (setTweets: React.Dispatch<React.SetStateAction<TweetType[]>>, id?: string, filter?: string) => void;
type UserTweetFunType = (setTweets: React.Dispatch<React.SetStateAction<TweetType[]>>, id: string) => void;

export const getTweets: getTweetFun = (setTweets, id, filter) => {
  let q;

  if (filter === "all") {
    // 전체 트윗 조회
    q = query(dbCollection(dbService, "tweets"), where("mention", "==", ""), orderBy("createdAt", "desc"));
  } else if (filter === "media") {
    // 미디어
    q = query(dbCollection(dbService, "tweets"), where("creatorId", "==", id), where("attachmentUrl", "!=", ""), orderBy("attachmentUrl"), orderBy("createdAt", "desc"));
  } else if (filter === "replies") {
    // 답글
    q = query(dbCollection(dbService, "tweets"), where("creatorId", "==", id), where("mention", "!=", ""), orderBy("mention"), orderBy("createdAt", "desc"));
  } else if (filter === "likes") {
    // 마음에 들어요
    q = query(dbCollection(dbService, "tweets"), where("likes", "array-contains", id), orderBy("createdAt", "desc"));
  } else {
    // 검색
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


// 프로필 페이지에서 사용자 트윗/RT 조회
export const getUserTweets: UserTweetFunType = async (setTweets, id) => {
  let myTweets: string[] = [];
  const q1 = query(dbCollection(dbService, "users"), where("id", "==", id));
  const snapshot = await getDocs(q1);
  snapshot.forEach((doc) => {
    myTweets = [...doc.data().myTweets];
  });

  if (myTweets.length > 0) {
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
      const result = tweetArr.filter((tweet) => myTweets.includes(tweet.id));
      const sortedArr = myTweets.filter((id) => result.map((a) => a.id).includes(id));
      let filtered: TweetType[] = [];
      sortedArr.forEach((a) => {
        for (let i = 0; i < sortedArr.length; i++) {
          if (result[i] && a === result[i].id) filtered.push(result[i]);
        }
      });
      console.log(sortedArr);
      setTweets(filtered);
    });
  }
};
