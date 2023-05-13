import { auth } from "fBase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
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
      let data;
      if (newAccount) {
        // create account
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // log in
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
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
