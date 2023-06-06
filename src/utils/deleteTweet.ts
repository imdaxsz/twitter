import { dbService, storageService } from "fBase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { TweetType } from "types/types";

type DeleteTweetFun = (tweetObj: TweetType, uid: string, myTweets: string[], setMore: React.Dispatch<React.SetStateAction<boolean>>) => void;

export const deleteTweet: DeleteTweetFun = async (tweetObj: TweetType, uid: string, myTweets: string[], setMore) => {
  const tweetTextRef = doc(dbService, "tweets", `${tweetObj.id}`);
  const urlRef = ref(storageService, tweetObj.attachmentUrl);
  const userRef = doc(dbService, "users", uid);
  const ok = window.confirm("트윗을 삭제할까요?");
  if (ok) {
    await deleteDoc(tweetTextRef);
    const result = myTweets.filter((id) => id !== tweetObj.id);
    await updateDoc(userRef, { myTweets: [...result] });
    if (tweetObj.attachmentUrl !== "") {
      await deleteObject(urlRef);
    }
    if (tweetObj.mention !== "") {
      // 트윗이 답글인 경우, 답글 달았던 트윗의 답글 개수 update
      const docRef = doc(dbService, "tweets", tweetObj.mention);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const result: string[] = docSnap.data().replies.filter((id: string) => id !== tweetObj.id);
        await updateDoc(docRef, { replies: result });
      }
    }
    setMore(false);
  }
};
