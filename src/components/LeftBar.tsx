import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { setIsNew, setModal } from "store/EditSlice";
import TweetModal from "./TweetModal";
import { auth } from "fBase";
import { RiMoreFill } from "react-icons/ri";
import { FaBell, FaBookmark, FaFeatherAlt, FaHashtag, FaRegBell, FaRegBookmark, FaRegUser, FaTwitter, FaUser } from "react-icons/fa";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { HiOutlineHashtag } from "react-icons/hi";
import { useMediaQuery } from "react-responsive";
import styles from "styles/leftbar.module.css";

function LeftBar({ uid }: { uid: string }) {
  const pathName = useLocation().pathname;
  const navigate = useNavigate();

  const [profileModal, setProfileModal] = useState(false);
  const { isNew, editModal: tweetModal } = useSelector((state: RootState) => state.edit);

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const isTablet = useMediaQuery({ maxWidth: 1298 });

  const onProfileClick = () => {
    setProfileModal(true);
  };

  const onProfileBlur = () => {
    setTimeout(() => setProfileModal(false), 100);
  };

  const onLogOutClick = () => {
    const ok = window.confirm("로그아웃할까요?");
    if (ok) {
      auth.signOut();
      navigate("/");
    }
  };

  const onTweetClick = () => {
    dispatch(setModal(true));
    dispatch(setIsNew(true));
  };

  return (
    <>
      {tweetModal && isNew && <TweetModal uid={uid} />}
      <div className={styles.wrapper}>
        <div className={styles.container}>
          {profileModal && (
            <div onClick={onLogOutClick} className={`${styles.modal} modal-shadow flex`}>
              <h4>로그아웃</h4>
            </div>
          )}
          <div className={styles.left}>
            <div className="logo-box">
              <Link to="/">
                <FaTwitter className={`logo ${styles.pl}`} />
              </Link>
            </div>
            <nav className={styles.navbar}>
              <ul>
                <li>
                  <Link to="/">
                    <div className={`${styles["nav-item"]} ${pathName === "/" && styles.active}`}>
                      {pathName === "/" ? <AiFillHome className={styles["nav-icon"]} /> : <AiOutlineHome className={styles["nav-icon"]} />}
                      <span>홈</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/explore">
                    <div className={`${styles["nav-item"]} ${pathName === "/explore" && styles.active}`}>
                      {pathName === "/explore" ? <FaHashtag className={styles["nav-icon"]} /> : <HiOutlineHashtag className={styles["nav-icon"]} />}
                      <span>
                        <b>탐색하기</b>
                      </span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="notifications">
                    <div className={`${styles["nav-item"]} ${pathName.split("/")[1] === "notifications" && styles.active}`}>
                      {pathName.split("/")[1] === "notifications" ? <FaBell className={styles["nav-icon"]} /> : <FaRegBell className={styles["nav-icon"]} />}
                      <span>알림</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to="/bookmarks">
                    <div className={`${styles["nav-item"]} ${pathName === "/bookmarks" && styles.active}`}>
                      {pathName === "/bookmarks" ? <FaBookmark className={styles["nav-icon"]} /> : <FaRegBookmark className={styles["nav-icon"]} />}

                      <span>북마크</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to={`/${user.id}`}>
                    <div className={`${styles["nav-item"]} ${pathName.split("/")[1] === user.id && styles.active}`}>
                      {pathName.split("/")[1] === user.id ? <FaUser className={styles["nav-icon"]} /> : <FaRegUser className={styles["nav-icon"]} />}
                      <span>프로필</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </nav>
            <button className="btn medium" onClick={onTweetClick}>
              {!isTablet ? "트윗하기" : <FaFeatherAlt />}
            </button>
          </div>
          <div className={styles.profile} tabIndex={-1} onClick={onProfileClick} onBlur={onProfileBlur}>
            <div className={styles["profile-img"]}>
              <img referrerPolicy="no-referrer" src={user.profileImg ? user.profileImg : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userimg"></img>
            </div>
            {!isTablet && (
              <>
                <div className={`${styles["profile-info"]} flex`}>
                  <div className={`${styles["profile-item"]} flex`}>
                    <h4>{user.name}</h4>
                  </div>
                  <div className={`${styles["profile-item"]} flex`}>
                    <p>@{user.id}</p>
                  </div>
                </div>
                <div className={`twticon-box more right ${styles.icon}`}>
                  <RiMoreFill className="icon" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftBar;
