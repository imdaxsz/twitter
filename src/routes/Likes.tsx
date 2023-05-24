import Tweet from "components/Tweet";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { useState } from "react";
import Loading from "components/Loading";

function Likes({ uid }: { uid: string }) {
  const [loading, setLoading] = useState(true);
  const tweets = useSelector((state: RootState) => state.user.likes);

  return (
    <div>
      {/* <Loading loading={loading} /> */}
      {tweets.map((tweet, i) => {
        return <Tweet key={tweet.id} tweetObj={tweet} uid={uid} />;
      })}
    </div>
  );
}

export default Likes;
