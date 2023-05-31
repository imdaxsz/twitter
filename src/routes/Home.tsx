import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { setIsNew, setModal } from "store/EditSlice";
import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";
import TopBar from "components/TopBar";
import Loading from "components/Loading";
import TweetModal from "components/TweetModal";
import { getTweets } from "utils/getTweet";
import { TweetType } from "types/types";
import { FaFeatherAlt } from "react-icons/fa";

const Home = ({ uid, isMobile }: { uid: string; isMobile?: boolean }) => {
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const [loading, setLoading] = useState(true);
  const edit = useSelector((state: RootState) => state.edit);
  const { isNew, editModal: tweetModal } = useSelector((state: RootState) => state.edit);
  const dispatch = useDispatch();

  useEffect(() => {
    getTweets(setTweets, undefined, "all");
    setLoading(false);
    return () => {
      setLoading(true);
    };
  }, []);

  const onTweetClick = () => {
    dispatch(setModal(true));
    dispatch(setIsNew(true));
  };

  return (
    <>
      {edit.editModal && edit.editObj.id !== "" && <TweetModal uid={uid} isMobile={isMobile} />}
      {isMobile && tweetModal && isNew && <TweetModal uid={uid} isMobile={isMobile} />}
      {isMobile && (
        <button className="btn medium mb-tweet" onClick={onTweetClick}>
          <FaFeatherAlt />
        </button>
      )}
      <div className="wrapper">
        <Loading loading={loading} />
        <TopBar title={"홈"} uid={uid} isMobile={isMobile} />
        <div className="container">
          {!isMobile && <TweetFactory uid={uid} />}
          <div>
            {tweets.map((tweet) => (
              <Tweet key={tweet.id} tweetObj={tweet} uid={uid} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
