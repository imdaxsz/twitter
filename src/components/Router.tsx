import { Routes, Route } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import { User } from "firebase/auth";
import LeftBar from "./LeftBar";
import RightBar from "./RightBar";
import BookMarks from "routes/Bookmarks";

interface Router {
  isLoggedIn: boolean;
  userObj: User | null;
  refreshUser: () => Promise<void>;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}

const AppRouter = ({ isLoggedIn, userObj, refreshUser, setMode }: Router) => {
  return (
    <div>
      <div className="main-container">
        {isLoggedIn && <LeftBar userObj={userObj} />}
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Home userObj={userObj} />} />
              <Route path="explore" element={<div></div>} />
              <Route path="notifications" element={<div></div>} />
              <Route path="bookmarks" element={<BookMarks userObj={userObj} />} />
              <Route path="/profile" element={<Profile userObj={userObj} refreshUser={refreshUser} />} />
            </>
          ) : (
            <Route path="/" element={<Auth />} />
          )}
          <Route path="*" element={<Auth />} />
        </Routes>
        <RightBar />
      </div>
    </div>
  );
};

export default AppRouter;
