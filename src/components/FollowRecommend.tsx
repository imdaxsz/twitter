import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { PersonProps } from "./Person";
import FollowBtn from "./FollowBtn";
import styles from "styles/rightbar.module.css";

function FollowRecommend({ user, uid }: PersonProps) {
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user);

  const onClick = () => {
    navigate(`${user.id}`);
  };

  return (
    <div className={styles.user} onClick={onClick}>
      <div className={styles.img}>
        <img src={user.profileImg ? user.profileImg : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userImg"></img>
      </div>
      <div className={styles["info-box"]}>
        <div className={`flex-col ${styles.info}`}>
          <div className={`underline ${styles.item}`}>
            <h4>{user.name}</h4>
          </div>
          <div className={styles.item}>
            <p>@{user.id}</p>
          </div>
        </div>
        <FollowBtn uid={uid} user={user} currentUser={currentUser} />
      </div>
    </div>
  );
}

export default FollowRecommend;
