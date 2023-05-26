import { useEffect, useState } from "react";
import Tweet, { TweetType } from "components/Tweet";
import TweetFactory from "components/TweetFactory";
import TopBar from "components/TopBar";
import Loading from "components/Loading";
import TweetModal from "components/TweetModal";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import getTweets from "hooks/getTweet";

const Home = ({ uid }: { uid: string }) => {
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const [loading, setLoading] = useState(true);
  const edit = useSelector((state: RootState) => state.edit);

  useEffect(() => {
    getTweets(setTweets, undefined, "all");
      setLoading(false);
    return () => {
      setLoading(true);
    };
  }, []);

  return (
    <>
      {edit.editModal && edit.editObj.id !== "" && <TweetModal uid={uid} />}
      <div className="wrapper">
        <Loading loading={loading} />
        <TopBar title={"홈"} uid={uid} />
        <div className="container">
          <TweetFactory uid={uid} />
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
