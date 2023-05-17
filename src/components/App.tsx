import AppRouter from "./Router";
import { useEffect, useState } from "react";
import { auth, dbService } from "fBase";
import { User, onAuthStateChanged, updateCurrentUser } from "firebase/auth";
import Initialization from "./Initialization";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { UserState, initUser, reset } from "store/userSlice";
import { doc, onSnapshot } from "firebase/firestore";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState<User | null>(null);
  const [uid, setUid] = useState("");

  const userData = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const getUserInfo = (uid: string) => {
    onSnapshot(doc(dbService, "users", uid), (doc) => {
      if (doc.exists()) {
        const useR: UserState = {
          id: doc.data().id,
          name: doc.data().name,
          joinDate: doc.data().joinDate,
          profileImg: doc.data().profileImg,
          headerImg: doc.data().headerImg,
          bio: doc.data().bio,
          likes: doc.data().likes,
          bookmarks: doc.data().bookmarks,
          follower: doc.data().follower,
          following: doc.data().following,
        };
        dispatch(initUser(useR));
        console.log(userData);
      }
    });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        getUserInfo(user.uid);
        setUserObj(user);
        setUid(user.uid);
      } else {
        // User is signed out
        setUserObj(null);
        dispatch(reset());
      }
      setInit(true);
    });
  }, []);

  const refreshUser = async () => {
    await updateCurrentUser(auth, auth.currentUser);
    setUserObj(auth.currentUser);
  };

  return <div className={`background`}>{init ? <AppRouter isLoggedIn={Boolean(userObj)} uid={uid} refreshUser={refreshUser} /> : <Initialization />}</div>;
}

export default App;
