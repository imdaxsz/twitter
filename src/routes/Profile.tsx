import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import TopBar from "components/TopBar";
import { MdCalendarMonth } from "react-icons/md";
import styles from "styles/profile.module.css";
import EditProfile from "components/EditProfile";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { onSnapshot, query, where } from "firebase/firestore";
import { dbCollection, dbService } from "fBase";

interface ProfileProps {
  uid: string;
}

interface UserInfo {
  id: string;
  name: string;
  bio: string;
  profileImg: string | null;
  headerImg: string | null;
  following: number;
  follower: number;
  joinDate: string;
}

const Profile = ({ uid }: ProfileProps) => {
  const location = useLocation();
  
  const { id: paramId } = useParams();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const user = useSelector((state: RootState) => state.user);
  const [modal, setModal] = useState(false);

  const onEditClick = () => {
    setModal(true);
  };

  const getUserData = async () => {
    const q = query(dbCollection(dbService, "users"), where("id", "==", `@${paramId}`));

    onSnapshot(q, (snapshot) => {
      const userObj: UserInfo = {
        id: snapshot.docs[0].data().id,
        name: snapshot.docs[0].data().name,
        bio: snapshot.docs[0].data().bio,
        profileImg: snapshot.docs[0].data().profileImg,
        headerImg: snapshot.docs[0].data().headerImg,
        follower: snapshot.docs[0].data().follower.length,
        following: snapshot.docs[0].data().following.length,
        joinDate: snapshot.docs[0].data().joinDate,
      };
      setUserInfo(userObj);
    });
  };

  useEffect(() => {
    getUserData();
  }, [paramId]);

  return (
    <>
      {modal && <EditProfile uid={uid} setModal={setModal} />}

      <div className="wrapper">
        <TopBar title={userInfo?.name ? userInfo.name : ""} uid={uid} />
        <div className="container">
          <div className={styles.header}>{userInfo?.headerImg ? <img src={userInfo.headerImg} alt="header"></img> : <div className={styles["default-header"]}></div>}</div>
          <div className={styles.profile}>
            <div className={styles.top}>
              <div className={styles["user-img"]}>
                <img referrerPolicy="no-referrer" src={userInfo?.profileImg ? userInfo?.profileImg : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userimg"></img>
              </div>
              {paramId === user.id.slice(1) ? (
                <button className={`small ${styles["edit-btn"]}`} onClick={onEditClick}>
                  프로필 수정
                </button>
              ) : (
                <button className={`small btn black`}>팔로우</button>
              )}
            </div>
            <div className={`${styles.info} flex-row`}>
              <div className={`flex ${styles.name}`}>
                <h4>{userInfo?.name}</h4>
              </div>
              <div className={`flex ${styles.id}`}>
                <p>{userInfo?.id}</p>
              </div>
            </div>
            {userInfo?.bio && (
              <div className={`flex ${styles.bio}`}>
                <p>{userInfo?.bio}</p>
              </div>
            )}
            <div className={`flex ${styles.join}`}>
              <MdCalendarMonth className={`icon ${styles["mr-4"]}`} />
              {userInfo && (
                <p>
                  가입일: {userInfo.joinDate.slice(0, 4)}년 {userInfo.joinDate[4]}월
                </p>
              )}
            </div>
            <div className={`flex ${styles.follow}`}>
              <div className={`flex ${styles.following}`}>
                <span>{userInfo?.following}</span>
                <p>&nbsp;팔로우 중</p>
              </div>
              <span>{userInfo?.follower}</span>
              <p>&nbsp;팔로워</p>
            </div>
          </div>
          <nav className={styles.nav}>
            <ul>
              <li className={styles["w-1"]}>
                <Link to="/profile">
                  <div className={`${styles.tab} ${location.pathname === `/profile/${user.id.slice(1)}` ? styles.active : ""}`}>
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
