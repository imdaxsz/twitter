import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import TopBar from "components/TopBar";
import Tweet from "components/Tweet";
import Loading from "components/Loading";
import { getBookmarks } from "utils/getBookmarks";
import { TweetType } from "types/types";

function BookMarks({ uid, isMobile }: { uid: string, isMobile:boolean }) {
  const [loading, setLoading] = useState(true);
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const { bookmarks } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    getBookmarks(setTweets, bookmarks);
    setLoading(false);
    return () => {
      setTweets([]);
    };
  }, [bookmarks]);

  return (
    <div className="wrapper">
      <Loading loading={loading} />
      <TopBar title={"북마크"} isMobile={isMobile} />
      <div className="container">
        <div>
          {tweets.map((tweet) => {
            return <Tweet key={tweet.id} tweetObj={tweet} uid={uid} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default BookMarks;
