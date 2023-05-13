import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { RiMoreFill, RiNotification2Line } from "react-icons/ri";
import { FaHashtag, FaTwitter } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { HiOutlineBookmark } from "react-icons/hi";
import { BiUser } from "react-icons/bi";
import { auth } from "fBase";
import styles from "styles/leftbar.module.css";

function LeftBar({ userObj }: { userObj: User | null }) {
  const location = useLocation();
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();

  const onProfileClick = () => {
    setModal(true);
  };

  const onProfileBlur = () => {
    setTimeout(() => setModal(false), 100);
  };

  const onLogOutClick = () => {
    const ok = window.confirm("로그아웃할까요?");
    if (ok) {
      auth.signOut();
      navigate("/");
    }
  };

  return (
    <div className={styles.container}>
      {modal && (
        <div onClick={onLogOutClick} className={`${styles.modal} modal-shadow flex`}>
          <h4>로그아웃</h4>
        </div>
      )}
      <div>
        <div className="logo-box">
          <Link to="/">
            <FaTwitter className={`logo ${styles.pl}`} />
            {/* <FontAwesomeIcon icon={faTwitter} className={styles.logo} size="2xl" /> */}
          </Link>
        </div>
        <nav className={styles.navbar}>
          <ul>
            <li>
              <Link to="/">
                <div className={`${styles["nav-item"]} ${location.pathname === "/" ? styles.active : ""}`}>
                  <AiFillHome className={styles["nav-icon"]} />
                  <span>홈</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/explore">
                <div className={`${styles["nav-item"]} ${location.pathname === "/explore" ? styles.active : ""}`}>
                  <FaHashtag className={styles["nav-icon"]} />
                  <span>
                    <b>탐색하기</b>
                  </span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/notifications">
                <div className={`${styles["nav-item"]} ${location.pathname === "/notifications" ? styles.active : ""}`}>
                  <RiNotification2Line className={styles["nav-icon"]} />
                  <span>알림</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/bookmarks">
                <div className={`${styles["nav-item"]} ${location.pathname === "/bookmarks" ? styles.active : ""}`}>
                  <HiOutlineBookmark className={styles["nav-icon"]} />
                  <span>북마크</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/profile">
                <div className={`${styles["nav-item"]} ${location.pathname === "/profile" ? styles.active : ""}`}>
                  <BiUser className={styles["nav-icon"]} />
                  <span>프로필</span>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
        <button className="btn medium">트윗하기</button>
      </div>
      <div className={styles.profile} tabIndex={-1} onClick={onProfileClick} onBlur={onProfileBlur}>
        <div className={styles["profile-img"]}>
          <img src={userObj?.photoURL ? userObj.photoURL : "img/default_profile.png"} alt="userImg"></img>
        </div>
        <div className={`${styles["profile-info"]} flex`}>
          <div className={`${styles["profile-item"]} flex`}>
            <h4>{userObj?.displayName}</h4>
          </div>
          <div className={`${styles["profile-item"]} flex`}>
            <p>@{userObj?.email?.split("@")[0]}</p>
          </div>
        </div>
        <div className="twticon-box more right">
          <RiMoreFill className="icon" />
        </div>
      </div>
    </div>
  );
}

export default LeftBar;
