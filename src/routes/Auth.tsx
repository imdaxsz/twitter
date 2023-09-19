import React, { useState } from "react";
import { UserState } from "store/userSlice";
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { auth, dbService } from "fBase";
import { doc, setDoc } from "firebase/firestore";
import AuthForm from "components/AuthForm";
import styles from "styles/auth.module.css";
import { FaTwitter, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Auth = () => {
  const [newAccount, setNewAccount] = useState(true);
  const onSocialClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = e;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    provider &&
      (await signInWithPopup(auth, provider).then(async (result) => {
        if (newAccount) {
          let id = "";
          if (typeof result.user.email === "string") id = result.user.email?.split("@")[0];

          let name = "";
          if (typeof result.user.displayName === "string") name = result.user.displayName;

          let profileImg = "";
          if (result.user.photoURL) profileImg = result.user.photoURL;

          const dt = new Date();
          const joinDate = dt.getFullYear().toString() + (dt.getMonth() + 1).toString();

          const userData: UserState = {
            id,
            name,
            joinDate,
            profileImg,
            headerImg: null,
            bio: "",
            myTweets: [],
            bookmarks: [],
            following: [],
            followers: [],
          };

          const userNoti = {
            follow: [],
            mentions: [],
            tweetNoti: [],
          };

          try {
            const userRef = await setDoc(doc(dbService, "users", result.user.uid), userData);
            console.log("Document wirtten with ID: ", userRef);
            const notiRef = await setDoc(doc(dbService, "notifications", userData.id), userNoti);
            console.log("Document wirtten with ID: ", notiRef);
          } catch (error) {
            console.error("Error adding document:", error);
          }
        }
      }));
  };

  return (
    <div className={styles.container}>
      <FaTwitter className="logo" />
      <AuthForm newAccount={newAccount} setNewAccount={setNewAccount} />
      <div className={styles.btns}>
        <button onClick={onSocialClick} name="google" className={styles.btn}>
          <div className={styles.icon}>
            <FcGoogle className={styles.ic} />
          </div>
          Google 계정으로 {newAccount ? "시작하기" : "로그인"}
        </button>
        <button onClick={onSocialClick} name="github" className={styles.btn}>
          <div className={styles.icon}>
            <FaGithub className={styles.ic} />
          </div>
          GitHub 계정으로 {newAccount ? "시작하기" : "로그인"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
