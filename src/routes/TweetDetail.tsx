import { useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "components/TopBar";
import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";
import ErrorPage from "./ErrorPage";
import { useGetTweetInfo } from "hooks/useGetTweetInfo";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import TweetModal from "components/TweetModal";

const TweetDetail = ({ uid, isMobile }: { uid: string; isMobile: boolean }) => {
  const { tweetId } = useParams();
  const { tweet, replies, setReplies, result, getReplies, getCurrentTweetInfo } = useGetTweetInfo();
  const edit = useSelector((state: RootState) => state.edit);
  useEffect(() => {
    if (tweetId) {
      getCurrentTweetInfo(tweetId);
    }
  }, [tweetId]);

  useEffect(() => {
    getReplies();
    return () => {
      setReplies([]);
    };
  }, [tweet?.replies]);

  return (
    <>
      {edit.editModal && edit.editObj.id !== "" && <TweetModal uid={uid} isMobile={isMobile} />}
      <div className="wrapper">
        <TopBar title="트윗" />
        <div className="container">
          {result ? (
            <>
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
            </>
          ) : (
            <ErrorPage />
          )}
        </div>
      </div>
    </>
  );
};

export default TweetDetail;
