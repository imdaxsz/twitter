import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCount } from "store/store";
import { getUserTweets } from "utils/getTweet";
import Tweet from "components/Tweet";
import Loading from "components/Loading";
import { TweetType } from "types/types";

const DefaultTweets = ({ uid }: { uid: string }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [tweets, setTweets] = useState<TweetType[]>([]);

  useEffect(() => {
    if (id) {
      getUserTweets(setTweets, id);
      setLoading(false);
    }
    return () => {
      setTweets([]);
    };
  }, [id]);

  useEffect(() => {
    dispatch(setCount(tweets.length));
  }, [tweets]);

  return (
    <div>
      <Loading loading={loading} />
      {tweets.map((tweet, i) => (
        <Tweet key={i} tweetObj={tweet} uid={uid} />
      ))}
    </div>
  );
};

export default DefaultTweets;
