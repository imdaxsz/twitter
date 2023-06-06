import { Routes, Route } from "react-router-dom";
import Auth from "routes/Auth";
import Root from "routes/Root";
import Profile from "routes/Profile";
import BookMarks from "routes/Bookmarks";
import Explore from "routes/Explore";
import Notifications from "routes/Notifications";
import ConnectPeople from "routes/ConnectPeople";
import Media from "routes/Media";
import DefaultTweets from "routes/DefaultTweet";
import Likes from "routes/Likes";
import TweetDetail from "routes/TweetDetail";
import SearchResult from "routes/SearchResult";
import Replies from "routes/Replies";
import FollowList from "routes/FollowList";
import { useMediaQuery } from "react-responsive";

interface Router {
  isLoggedIn: boolean;
  uid: string;
}

const AppRouter = ({ isLoggedIn, uid }: Router) => {
  const isMobile = useMediaQuery({ maxWidth: 499 });
  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/" element={<Root uid={uid} isMobile={isMobile} />}>
            <Route path="explore" element={<Explore uid={uid} />} />
            <Route path="notifications" element={<Notifications />}/>
            <Route path="notifications/follow" element={<Notifications />}/>
            <Route path="notifications/mentions" element={<Notifications />}/>
            <Route path="bookmarks" element={<BookMarks uid={uid} isMobile={isMobile} />} />
            <Route path="/:id" element={<Profile uid={uid} isMobile={isMobile} />}>
              <Route path="" element={<DefaultTweets uid={uid} />} />
              <Route path="with_replies" element={<Replies uid={uid} />} />
              <Route path="media" element={<Media uid={uid} />} />
              <Route path="likes" element={<Likes uid={uid} />} />
              <Route path="followers" element={<FollowList uid={uid} />} />
              <Route path="following" element={<FollowList uid={uid} />} />
            </Route>
            <Route path="/:id/status/:tweetId" element={<TweetDetail uid={uid} isMobile={isMobile} />} />
            <Route path="connect_people" element={<ConnectPeople uid={uid} />} />
            <Route path="search" element={<SearchResult uid={uid} />} />
          </Route>
        </>
      ) : (
        <Route path="/" element={<Auth />} />
      )}
    </Routes>
  );
};

export default AppRouter;
