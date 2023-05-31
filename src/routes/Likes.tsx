import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCount } from "store/store";
import { useParams } from "react-router-dom";
import Tweet from "components/Tweet";
import Loading from "components/Loading";
import { getTweets } from "utils/getTweet";
import { TweetType } from "types/types";

function Likes({ uid }: { uid: string }) {
  const [loading, setLoading] = useState(true);
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    getTweets(setTweets, id, "likes");
    setLoading(false);
    dispatch(setCount(tweets.length));
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
          <h2>아직 마음에 들어한 트윗이 없습니다</h2>
          <p>좋아하는 트윗의 하트를 눌러 마음에 들어요 표시를 해보세요. 마음에 들어한 트윗은 여기에 표시됩니다.</p>
        </div>
      )}
    </div>
  );
}

export default Likes;
