import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCount } from "store/store";
import { getTweets } from "utils/getTweet";
import Tweet from "components/Tweet";
import Loading from "components/Loading";
import { TweetType } from "types/types";

const Replies = ({ uid }: { uid: string }) => {
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      getTweets(setTweets, id, "replies");
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

export default Replies;
