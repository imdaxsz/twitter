import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import TopBar from "components/TopBar";
import EditProfile from "components/EditProfile";
import FollowBtn from "components/FollowBtn";
import { PersonType, UserInfo } from "types/types";
import { getUserProfile } from "utils/getUsers";
import styles from "styles/profile.module.css";
import { MdCalendarMonth } from "react-icons/md";

interface ProfileProps {
  uid: string;
  isMobile: boolean;
}

const Profile = ({ uid, isMobile }: ProfileProps) => {
  const location = useLocation();

  const { id: paramId } = useParams();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userBtnProps, setUserBtnProps] = useState<PersonType | null>(null);

  const user = useSelector((state: RootState) => state.user);
  const [modal, setModal] = useState(false);

  const onEditClick = () => {
    setModal(true);
  };

  useEffect(() => {
    if (paramId) getUserProfile(paramId, setUserInfo, setUserBtnProps);
  }, [paramId]);

  return (
    <>
      {modal && <EditProfile uid={uid} setModal={setModal} />}

      <div className="wrapper">
        <TopBar title={userInfo?.name ? userInfo.name : ""} isMobile={isMobile} />
        <div className="container">
          {!["following", "followers"].includes(location.pathname.split("/").slice(-1)[0]) && (
            <>
              <div className={styles.header}>{userInfo?.headerImg ? <img src={userInfo.headerImg} alt="header"></img> : <div className={styles["default-header"]}></div>}</div>
              <div className={styles.profile}>
                <div className={styles.top}>
                  <div className={styles["user-img"]}>
                    <img referrerPolicy="no-referrer" src={userInfo?.profileImg ? userInfo?.profileImg : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userimg"></img>
                  </div>
                  {paramId === user.id ? (
                    <button className={`small ${styles["edit-btn"]}`} onClick={onEditClick}>
                      프로필 수정
                    </button>
                  ) : (
                    userBtnProps && <FollowBtn uid={uid} userId={userInfo?.id as string} currentUser={user} />
                  )}
                </div>
                <div className={`${styles.info} flex-row`}>
                  <div className={`flex ${styles.name}`}>
                    <h4>{userInfo?.name}</h4>
                  </div>
                  <div className={`flex ${styles.id}`}>
                    <p>@{userInfo?.id}</p>
                  </div>
                </div>
                {userInfo?.bio && (
                  <div className={`flex ${styles.bio}`}>
                    <span>{userInfo?.bio}</span>
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
                  <Link to={"following"}>
                    <div className={`flex underline ${styles.following}`}>
                      <span>{userInfo?.following}</span>
                      <p>&nbsp;팔로우 중</p>
                    </div>
                  </Link>
                  <Link to={"followers"}>
                    <div className={`flex underline `}>
                      <span>{userInfo?.followers}</span>
                      <p>&nbsp;팔로워</p>
                    </div>
                  </Link>
                </div>
              </div>
              <nav className={styles.nav}>
                <ul>
                  <li className={styles["w-1"]}>
                    <Link to={`/${paramId}`}>
                      <div className={`${styles.tab} ${location.pathname.split("/").slice(-1)[0] === paramId && "active"}`}>
                        <div className={styles.box}>
                          <p>트윗</p>
                          {location.pathname.split("/").slice(-1)[0] === paramId && <div className="active-bar" />}
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className={styles["w-1"]}>
                    <Link to={`/${paramId}/with_replies`}>
                      <div className={`${styles.tab} ${location.pathname.split("/").slice(-1)[0] === "with_replies" && "active"}`}>
                        <div className={styles.box}>
                          <p>답글</p>
                          {location.pathname.split("/").slice(-1)[0] === "with_replies" && <div className="active-bar" />}
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className={styles["w-2"]}>
                    <Link to={`/${paramId}/media`}>
                      <div className={`${styles.tab} ${location.pathname.split("/").slice(-1)[0] === "media" && "active"}`}>
                        <div className={styles.box}>
                          <p>미디어</p>
                          {location.pathname.split("/").slice(-1)[0] === "media" && <div className="active-bar" />}
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className={styles["w-3"]}>
                    <Link to={`/${paramId}/likes`}>
                      <div className={`${styles.tab} ${location.pathname.split("/").slice(-1)[0] === "likes" && "active"}`}>
                        <div className={styles.box}>
                          <p>마음에 들어요</p>
                          {location.pathname.split("/").slice(-1)[0] === "likes" && <div className="active-bar" />}
                        </div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </nav>
            </>
          )}
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Profile;
