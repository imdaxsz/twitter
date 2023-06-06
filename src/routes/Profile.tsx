import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import TopBar from "components/TopBar";
import EditProfile from "components/EditProfile";
import FollowBtn from "components/FollowBtn";
import { PersonType, UserInfo } from "types/types";
import { getUserProfile } from "utils/getUsers";
import styles from "styles/profile.module.css";
import { MdCalendarMonth } from "react-icons/md";
import TweetModal from "components/TweetModal";
import { setIsNew, setModal as setTweetModal } from "store/EditSlice";
import { FaFeatherAlt } from "react-icons/fa";
import ErrorPage from "./ErrorPage";

interface ProfileProps {
  uid: string;
  isMobile: boolean;
}

const Profile = ({ uid, isMobile }: ProfileProps) => {
  const pathname = useLocation().pathname.split("/").slice(-1)[0];

  const { id: paramId } = useParams();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userBtnProps, setUserBtnProps] = useState<PersonType | null>(null);

  const user = useSelector((state: RootState) => state.user);
  const edit = useSelector((state: RootState) => state.edit);
  const [modal, setModal] = useState(false);
  const { isNew, editModal: tweetModal } = useSelector((state: RootState) => state.edit);
  const dispatch = useDispatch();
  const [result, setResult] = useState(false);

  const onEditClick = () => {
    setModal(true);
  };

  const onTweetClick = () => {
    dispatch(setTweetModal(true));
    dispatch(setIsNew(true));
  };

  const onImgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.id === "header" && userInfo?.headerImg) window.open(userInfo.headerImg);
    else if (e.currentTarget.id === "userImg" && userInfo?.profileImg) window.open(userInfo.profileImg);
  };

  useEffect(() => {
    if (paramId) getUserProfile(setResult, paramId, setUserInfo, setUserBtnProps);
    return () => setResult(false);
  }, [paramId]);

  return (
    <>
      {modal && <EditProfile uid={uid} setModal={setModal} />}
      {edit.editModal && edit.editObj.id !== "" && <TweetModal uid={uid} isMobile={isMobile} />}
      {isMobile && tweetModal && isNew && <TweetModal uid={uid} isMobile={isMobile} />}
      {isMobile && (
        <button className="btn medium mb-tweet" onClick={onTweetClick}>
          <FaFeatherAlt />
        </button>
      )}
      <div className="wrapper">
        <TopBar title={userInfo?.name ? userInfo.name : ""} isMobile={isMobile} />
        <div className="container">
          {result ? (
            <>
              {!["following", "followers"].includes(pathname) && (
                <>
                  <div id="header" className={styles.header} onClick={onImgClick}>
                    {userInfo?.headerImg ? <img src={userInfo.headerImg} alt="header"></img> : <div className={styles["default-header"]}></div>}
                  </div>
                  <div className={styles.profile}>
                    <div className={styles.top}>
                      <div id="userImg" className={styles["user-img"]} onClick={onImgClick}>
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
                  <nav className="nav">
                    <ul>
                      <li className={styles["w-1"]}>
                        <Link to={`/${paramId}`}>
                          <div className={`tab ${pathname === paramId && "active"}`}>
                            <div className="tab-box">
                              <p>트윗</p>
                              {pathname === paramId && <div className="active-bar" />}
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li className={styles["w-1"]}>
                        <Link to={`/${paramId}/with_replies`}>
                          <div className={`tab ${pathname === "with_replies" && "active"}`}>
                            <div className="tab-box">
                              <p>답글</p>
                              {pathname === "with_replies" && <div className="active-bar" />}
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li className={styles["w-2"]}>
                        <Link to={`/${paramId}/media`}>
                          <div className={`tab ${pathname === "media" && "active"}`}>
                            <div className="tab-box">
                              <p>미디어</p>
                              {pathname === "media" && <div className="active-bar" />}
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li className={styles["w-3"]}>
                        <Link to={`/${paramId}/likes`}>
                          <div className={`tab ${pathname === "likes" && "active"}`}>
                            <div className="tab-box">
                              <p>마음에 들어요</p>
                              {pathname === "likes" && <div className="active-bar" />}
                            </div>
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </>
              )}
              <Outlet />
            </>
          ) : (
            <ErrorPage />
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
