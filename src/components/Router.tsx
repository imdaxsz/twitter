import { Routes, Route } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";
import { User } from "firebase/auth";

interface router {
  isLoggedIn: boolean;
  userObj: User | null;
  refreshUser: () => Promise<void>;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}

const AppRouter = ({ isLoggedIn, userObj, refreshUser, setMode }: router) => {
  return (
    <div>
      {isLoggedIn && <Navigation userObj={userObj} setMode={setMode} />}
      <div
        style={{
          maxWidth: 890,
          width: "100%",
          margin: "0 auto",
          marginTop: 80,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Home userObj={userObj} />} />
              <Route path="/profile" element={<Profile userObj={userObj} refreshUser={refreshUser} />} />
            </>
          ) : (
            <Route path="/" element={<Auth />} />
          )}
        </Routes>
      </div>
    </div>
  );
};

export default AppRouter;
