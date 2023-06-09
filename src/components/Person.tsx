import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import FollowBtn from "./FollowBtn";
import { PersonType } from "types/types";
import styles from "styles/person.module.css";

export interface PersonProps {
  user: PersonType;
  uid: string;
}

const Person = ({ user, uid }: PersonProps) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user);

  const onClick = () => {
    navigate(`/${user.id}`);
  };

  return (
    <div className={`flex p1 ${styles.container}`} onClick={onClick}>
      <div className="user-img">
        <img referrerPolicy="no-referrer" src={user.profileImg ? user.profileImg : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userImg"></img>
      </div>
      <div className={styles.content}>
        <div className={`${styles.top} flex`}>
          <div className="h1">
            <div className="flex flex-item underline">
              <h4>{user.name}</h4>
            </div>
            <div className="flex flex-item">
              <p>@{user.id}</p>
            </div>
          </div>
          {currentUser.id !== user.id && <FollowBtn uid={uid} userId={user.id} currentUser={currentUser} />}
        </div>
        {user.bio && (
          <div className={`${styles.bio} flex`}>
            <span>{user.bio}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Person;
