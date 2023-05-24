import TopBar from "components/TopBar";
import Tweet from "components/Tweet";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { useState } from "react";
import Loading from "components/Loading";

function BookMarks({ uid }: { uid: string }) {
  const [loading, setLoading] = useState(true);
  const tweets = useSelector((state: RootState) => state.user.bookmarks);

  return (
    <div className="wrapper">
      {/* <Loading loading={loading } /> */}
      <TopBar title={"북마크"} uid={uid} />
      <div className="container">
        <div>
          {tweets.map((tweet, i) => {
            return <Tweet key={tweet.id} tweetObj={tweet} uid={uid} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default BookMarks;
