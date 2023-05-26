import Tweet, { TweetType } from "components/Tweet";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import getTweets from "hooks/getTweet";
import Loading from "components/Loading";
import { useDispatch } from "react-redux";
import { setCount } from "store/store";

const Media = ({ uid }: { uid: string }) => {
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      getTweets(setTweets, id, "media");
      setLoading(false);
      dispatch(setCount(tweets.length));
    }
    return () => {
      setLoading(true);
    };
  }, [tweets]);

  return (
    <div>
      <Loading loading={loading} />
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweetObj={tweet} uid={uid} />
      ))}
    </div>
  );
};

export default Media;
