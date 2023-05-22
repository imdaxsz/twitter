import styles from "styles/rightbar.module.css";
import { useNavigate } from "react-router-dom";
import { PeopleType } from "./People";

function FollowRecommend({ id, name, profileImg }: PeopleType) {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`profile/${id}`);
  };

  const onFollowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // follow / unfollow 하기
    console.log("test");
  };

  return (
    <div className={styles.user} onClick={onClick}>
      <div className={styles.img}>
        <img src={profileImg ? profileImg : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userImg"></img>
      </div>
      <div className={styles["info-box"]}>
        <div className={`flex-col ${styles.info}`}>
          <div className={styles.item}>
            <h4>{name}</h4>
          </div>
          <div className={styles.item}>
            <p>@{id}</p>
          </div>
        </div>
        <button className="btn xs black" onClick={onFollowClick}>
          팔로우
        </button>
      </div>
    </div>
  );
}

export default FollowRecommend;
