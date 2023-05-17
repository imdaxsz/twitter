import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TopBar from "components/TopBar";
import { MdCalendarMonth } from "react-icons/md";
import styles from "styles/profile.module.css";
import EditProfile from "components/EditProfile";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

interface ProfileProps {
  // userObj: User | null;
  uid: string;
  refreshUser: () => Promise<void>;
}

const Profile = ({ uid, refreshUser }: ProfileProps) => {
  const user = useSelector((state: RootState) => state.user);
  const [modal, setModal] = useState(false);

  const onEditClick = () => {
    setModal(true);
  }

  // const getUserData = (uid: string) => {
  //   onSnapshot(doc(dbService, "users", uid), (doc) => {
  //     if (doc.exists()) {
  //       setName(doc.data().name);
  //       setBio(doc.data().bio);
  //       setFollower(doc.data().follower);
  //       setFollowing(doc.data().following);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   getUserData(uid);
  // }, [uid, bio, name]);

  const location = useLocation();

  return (
    <>
      {modal && <EditProfile uid={uid} setModal={setModal} />}

      <div className="wrapper">
        <TopBar title={user.name} uid={uid} />
        <div className="container">
          <div className={styles.header}>{user.headerImg === "" ? <div className={styles["default-header"]}></div> : <img src={user.headerImg} alt="header"></img>}</div>
          <div className={styles.profile}>
            <div className={styles.top}>
              <div className={styles["user-img"]}>
                <img src={user.profileImg !== "" ? user.profileImg : "img/default_profile.png"} alt="userImg"></img>
              </div>
              <button className={`small ${styles["edit-btn"]}`} onClick={onEditClick}>
                프로필 수정
              </button>
            </div>
            <div className={`${styles.info} flex-row`}>
              <div className={`flex ${styles.name}`}>
                <h4>{user.name}</h4>
              </div>
              <div className={`flex ${styles.id}`}>
                <p>{user.id}</p>
              </div>
            </div>
            {user.bio && (
              <div className={`flex ${styles.bio}`}>
                <p>{user.bio}</p>
              </div>
            )}
            <div className={`flex ${styles.join}`}>
              <MdCalendarMonth className={`icon ${styles["mr-4"]}`} />
              <p>
                가입일: {user.joinDate.slice(0, 4)}년 {user.joinDate[4]}월
              </p>
            </div>
            <div className={`flex ${styles.follow}`}>
              <div className={`flex ${styles.following}`}>
                <span>{user.following.length}</span>
                <p>&nbsp;팔로우 중</p>
              </div>
              <span>{user.follower.length}</span>
              <p>&nbsp;팔로워</p>
            </div>
          </div>
          <nav className={styles.nav}>
            <ul>
              <li className={styles["w-1"]}>
                <Link to="/profile">
                  <div className={`${styles.tab} ${location.pathname === "/profile" ? styles.active : ""}`}>
                    <p>트윗</p>
                  </div>
                </Link>
              </li>
              <li className={styles["w-1"]}>
                <Link to="/profile/with_replies">
                  <div className={`${styles.tab} ${location.pathname === "/profile/with_replies" ? styles.active : ""}`}>
                    <p>답글</p>
                  </div>
                </Link>
              </li>
              <li className={styles["w-2"]}>
                <Link to="/profile/media">
                  <div className={`${styles.tab} ${location.pathname === "/profile/media" ? styles.active : ""}`}>
                    <p>미디어</p>
                  </div>
                </Link>
              </li>
              <li className={styles["w-3"]}>
                <Link to="/profile/likes">
                  <div className={`${styles.tab} ${location.pathname === "/profile/likes" ? styles.active : ""}`}>
                    <p>마음에 들어요</p>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Profile;
