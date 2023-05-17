import { Routes, Route } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import LeftBar from "./LeftBar";
import RightBar from "./RightBar";
import BookMarks from "routes/Bookmarks";
import Explore from "routes/Explore";
import Notifications from "routes/Notifications";

interface Router {
  isLoggedIn: boolean;
  uid: string;
  refreshUser: () => Promise<void>;
  // setMode: React.Dispatch<React.SetStateAction<string>>;
}

const AppRouter = ({ isLoggedIn, uid, refreshUser }: Router) => {
  return (
    <div>
      <div className="app-container">
        {isLoggedIn && <LeftBar />}
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Home uid={uid} />} />
              <Route path="explore" element={<Explore />} />
              <Route path="notifications" element={<Notifications uid={uid} />} />
              <Route path="bookmarks" element={<BookMarks uid={uid} />} />
              <Route path="profile" element={<Profile uid={uid} refreshUser={refreshUser} />} />
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
