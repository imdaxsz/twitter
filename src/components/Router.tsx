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
import  Media  from "routes/Media";
import DefaultTweets from "routes/DefaultTweet";

interface Router {
  isLoggedIn: boolean;
  uid: string;
  // setMode: React.Dispatch<React.SetStateAction<string>>;
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
              <Route path="profile/:id" element={<Profile uid={uid} />}>
                <Route path="" element={<DefaultTweets uid={uid} />} />
                <Route path="with_replies" element={<div>답글</div>} />
                <Route path="media" element={<Media uid={uid} />} />
                <Route path="likes" element={<div>마음에 들어요</div>} />
                <Route path="follower" element={<div>팔로워</div>}/>
                <Route path="following" element={<div>팔로잉</div>}/>
              </Route>
              <Route path="connect_people" element={<ConnectPeople uid={uid} />} />
            </>
          ) : (
            <Route path="/" element={<Auth />} />
          )}
          <Route path="*" element={<Auth />} />
        </Routes>
        {isLoggedIn && <RightBar />}
      </div>
    </div>
  );
};

export default AppRouter;
