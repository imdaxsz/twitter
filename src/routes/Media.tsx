import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCount } from "store/store";
import Tweet from "components/Tweet";
import Loading from "components/Loading";
import { getTweets } from "utils/getTweet";
import { TweetType } from "types/types";

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
      {tweets.length > 0 ? (
        <>
          {tweets.map((tweet) => (
            <Tweet key={tweet.id} tweetObj={tweet} uid={uid} />
          ))}
        </>
      ) : (
        <div className="no-tweet">
          <h2>조명, 카메라... 첨부!</h2>
          <p>사진을 포함한 트윗을 보내면 여기에 표시됩니다.</p>
        </div>
      )}
    </div>
  );
};

export default Media;
