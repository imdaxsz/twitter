import AppRouter from "./Router";
import { useEffect, useState } from "react";
import { auth } from "fBase";
import { User, onAuthStateChanged, updateCurrentUser } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState<User | null>(null);
  const [mode, setMode] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUserObj(user);
      } else {
        // User is signed out
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = async () => {
    await updateCurrentUser(auth, auth.currentUser);
    setUserObj(auth.currentUser);
  };

  return (
    <div className={`background ${mode}`}>
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} refreshUser={refreshUser} setMode={setMode} /> : "Initializing...."}
      {/* <footer>&copy; {new Date().getFullYear()} mtwitter</footer> */}
    </div>
  );
}

export default App;