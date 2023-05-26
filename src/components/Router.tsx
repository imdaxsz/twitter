import { Routes, Route } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import LeftBar from "./LeftBar";
import RightBar from "./RightBar";
import BookMarks from "routes/Bookmarks";
import Explore from "routes/Explore";
import Notifications from "routes/Notifications";
import ConnectPeople from "routes/ConnectPeople";
import Media from "routes/Media";
import DefaultTweets from "routes/DefaultTweet";
import Following from "routes/FollowList";
import Likes from "routes/Likes";
import TweetDetail from "routes/TweetDetail";
import SearchResult from "routes/SearchResult";
import Replies from "routes/Replies";

interface Router {
  isLoggedIn: boolean;
  uid: string;
}

const AppRouter = ({ isLoggedIn, uid }: Router) => {
  return (
    <div>
      <div className="app-container">
        {isLoggedIn && <LeftBar uid={uid} />}
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Home uid={uid} />} />
              <Route path="explore" element={<Explore />} />
              <Route path="notifications" element={<Notifications uid={uid} />} />
              <Route path="bookmarks" element={<BookMarks uid={uid} />} />
              <Route path="/:id" element={<Profile uid={uid} />}>
                <Route path="" element={<DefaultTweets uid={uid} />} />
                <Route path="with_replies" element={<Replies uid={uid} />} />
                <Route path="media" element={<Media uid={uid} />} />
                <Route path="likes" element={<Likes uid={uid} />} />
                <Route path="followers" element={<Following uid={uid} filter="followers" />} />
                <Route path="following" element={<Following uid={uid} filter="following" />} />
              </Route>
              <Route path="/:id/status/:tweetId" element={<TweetDetail uid={uid} />} />
              <Route path="connect_people" element={<ConnectPeople uid={uid} />} />
              <Route path="search/*" element={<SearchResult />} />
            </>
          ) : (
            <Route path="/" element={<Auth />} />
          )}
          <Route path="*" element={<Auth />} />
        </Routes>
        {isLoggedIn && <RightBar uid={uid} />}
      </div>
    </div>
  );
};

export default AppRouter;
