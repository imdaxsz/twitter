import { AiOutlineRetweet } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { RiHeart3Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import styles from "styles/noti.module.css";
import { TweetType } from "types/types";
import { useEffect } from "react";
import { useState } from "react";
import { getUserInfo } from "utils/getUsers";
import { TbMessageCircle2Filled } from "react-icons/tb";

const Noti = ({ opt, tweetObj, uid }: { opt: string; uid: string; tweetObj?: TweetType }) => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [userImg, setUserImg] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    getUserInfo(setName, setUserImg, uid, setUserId);
  }, []);

  const onNotiClick = () => {
    if (opt === "follow") {
      navigate(`/${userId}`);
    } else {
      if (tweetObj) navigate(`/${tweetObj.creatorId}/status/${tweetObj.id}`);
    }
  };

  const onUserClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigate(`/${userId}`);
  };

  return (
    <div className={styles.container} onClick={onNotiClick}>
      {opt === "retweet" && (
        <div className={`${styles["icon-area"]}`}>
          <AiOutlineRetweet className={`${styles.icon} ${styles.green}`} />
        </div>
      )}
      {opt === "like" && (
        <div className={`${styles["icon-area"]}`}>
          <RiHeart3Fill className={`${styles.icon} ${styles.pink}`} />
        </div>
      )}
      {opt === "reply" && (
        <div className={`${styles["icon-area"]}`}>
          <TbMessageCircle2Filled className={`${styles.icon} fill`} />
        </div>
      )}
      {opt === "follow" && (
        <div className={`${styles["icon-area"]}`}>
          <div className={styles.icon}>
            <FaUser className={` ${styles.follow} fill`} />
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.img} onClick={onUserClick}>
          <img referrerPolicy="no-referrer" src={userImg ? userImg : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userImg"></img>
        </div>
        <div className={styles.noti}>
          <span className={styles.name} onClick={onUserClick}>
            {name}
          </span>
          {opt === "like" && <span>&nbsp;님이 내 트윗을 마음에 들어 합니다.</span>}
          {opt === "retweet" && <span>&nbsp;님이 내 트윗을 리트윗했습니다.</span>}
          {opt === "reply" && <span>&nbsp;님이 내 트윗에 답글을 달았습니다.</span>}
          {opt === "follow" && <span>&nbsp;님이 나를 팔로우했습니다.</span>}
        </div>
        <div className={styles.tweet}>
          <p>{tweetObj && tweetObj.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Noti;
