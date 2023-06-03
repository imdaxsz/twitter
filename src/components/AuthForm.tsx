import React, { useState } from "react";
import { auth, dbService } from "fBase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateCurrentUser } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { UserState } from "store/userSlice";
import styles from "styles/auth.module.css";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { name, value },
    } = e;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 동작 실행 X
    try {
      if (newAccount) {
        // create account
        await createUserWithEmailAndPassword(auth, email, password).then(async (result) => {
          let id = "";

          if (result.user.displayName !== "") {
            if (typeof result.user.email === "string") id = result.user.email?.split("@")[0];
            await updateProfile(result.user, { displayName: id });
            await updateCurrentUser(auth, auth.currentUser);
          }

          const dt = new Date();
          const joinDate = dt.getFullYear().toString() + (dt.getMonth() + 1).toString();

          const userData: UserState = {
            id,
            name: id,
            joinDate,
            profileImg: null,
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
            tweetNoti: []
          }

          try {
            const userRef = await setDoc(doc(dbService, "users", result.user.uid), userData);
            console.log("Document wirtten with ID: ", userRef);
            const notiRef = await setDoc(doc(dbService, "notifications", userData.id), userNoti);
            console.log("Document wirtten with ID: ", notiRef);
          } catch (error) {
            console.error("Error adding document:", error);
          }
        });
      } else {
        // log in
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <>
      <form onSubmit={onSubmit} className={styles["form-container"]}>
        <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange} className={styles.input} />
        <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} className={styles.input} />
        <input type="submit" className={`btn ${styles.submit}`} value={newAccount ? "계정 만들기" : "로그인"} />
        {error && <span className={styles.error}>{error}</span>}
      </form>
      <p onClick={toggleAccount} className={styles.switch}>
        {newAccount ? (
          <>
            이미 계정이 있으신가요? <span className={styles.blue}>로그인</span>
          </>
        ) : (
          <>
            계정이 없으신가요? <span className={styles.blue}>가입하기</span>
          </>
        )}
      </p>
    </>
  );
};

export default AuthForm;