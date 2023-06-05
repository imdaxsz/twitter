import AppRouter from "./Router";
import Initialization from "./Initialization";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { UserState, initUser, reset } from "store/userSlice";
import { auth, dbService } from "fBase";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

function App() {
  const [init, setInit] = useState(false);
  const [uid, setUid] = useState("");

  const userObj = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const getUser = (user: User) => {
    let userObj: UserState;
    onSnapshot(doc(dbService, "users", user.uid), (doc) => {
      if (doc.exists()) {
        userObj = {
          id: doc.data().id,
          name: doc.data().name,
          joinDate: doc.data().joinDate,
          profileImg: user.photoURL,
          headerImg: doc.data().headerImg,
          bio: doc.data().bio,
          myTweets: doc.data().myTweets,
          bookmarks: doc.data().bookmarks,
          following: doc.data().following,
          followers: doc.data().followers,
        };
        dispatch(initUser(userObj));
      }
    });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        getUser(user);
        setUid(user.uid);
      } else {
        // User is signed out
        dispatch(reset());
      }
      setInit(true);
    });
  }, []);


  // 모바일 화면 높이 조정
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  useEffect(() => {
    setScreenSize();
  });

  return <div className={`background`}>{init ? <AppRouter isLoggedIn={Boolean(userObj.id !== "")} uid={uid} /> : <Initialization />}</div>;
}

export default App;
