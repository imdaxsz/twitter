import styles from "styles/rightbar.module.css";
import { useNavigate } from "react-router-dom";
import { PersonProps } from "./Person";
import { useState, useEffect } from "react";
import { follow, unFollow } from "hooks/follow";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

function FollowRecommend({ user, uid, followList }: PersonProps) {
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user);

  const initState = followList.findIndex((following) => following.id === user.id) >= 0;
  const [following, setFollowing] = useState(initState);
  const [btnText, setBtnText] = useState(0);

  const onClick = () => {
    navigate(`profile/${user.id}`);
  };

  const onFollowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    follow(uid, user, currentUser, followList);
    setFollowing(true);
  };

  const onUnfollowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    unFollow(uid, user, currentUser, followList);
    setFollowing(false);
  };

  useEffect(() => {
    if (followList.findIndex((following) => following.id === user.id) >= 0) setFollowing(true);
    else setFollowing(false);
  }, [followList]);

  return (
    <div className={styles.user} onClick={onClick}>
      <div className={styles.img}>
        <img src={user.profileImg ? user.profileImg : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userImg"></img>
      </div>
      <div className={styles["info-box"]}>
        <div className={`flex-col ${styles.info}`}>
          <div className={styles.item}>
            <h4>{user.name}</h4>
          </div>
          <div className={styles.item}>
            <p>@{user.id}</p>
          </div>
        </div>
        {following ? (
          <button className="btn xs btn-white" onMouseEnter={() => setBtnText(1)} onMouseLeave={() => setBtnText(0)} onClick={onUnfollowClick}>
            {btnText === 0 ? "팔로잉" : "언팔로우"}
          </button>
        ) : (
          <button className="btn xs black" onClick={onFollowClick}>
            팔로우
          </button>
        )}
      </div>
    </div>
  );
}

export default FollowRecommend;
