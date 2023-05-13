import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { auth } from "fBase";
import AuthForm from "components/AuthForm";
import styles from "styles/auth.module.css";
import { FaTwitter, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Auth = () => {
  // const auth = getAuth();
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
    provider && await signInWithPopup(auth, provider);
  };

  return (
    <div className={styles.container}>
      <FaTwitter className="logo" />
      <AuthForm />
      <div className={styles.btns}>
        <button onClick={onSocialClick} name="google" className={styles.btn}>
          <div className={styles.icon}>
            <FcGoogle className={styles.ic} />
          </div>
          Google 계정으로 로그인
        </button>
        <button onClick={onSocialClick} name="github" className={styles.btn}>
          <div className={styles.icon}>
            <FaGithub className={styles.ic} />
          </div>
          GitHub 계정으로 로그인
        </button>
      </div>
    </div>
  );
};

export default Auth;
