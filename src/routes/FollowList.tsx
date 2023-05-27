import Person, { PersonType } from "components/Person";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { RootState } from "store/store";
import styles from "styles/profile.module.css";
import { useEffect } from "react";
import { useState } from "react";
import { getUserFollowList } from "hooks/getUsers";

const FollowList = ({ uid, filter }: { uid: string; filter: string }) => {
  const location = useLocation();
  const { id: paramId } = useParams();
  const [following, setFollowing] = useState<PersonType[]>([]);
  const [followers, setFollowers] = useState<PersonType[]>([]);

  useEffect(() => {
    if (filter === "following" && paramId) getUserFollowList(setFollowing, paramId, "following");
    else if (filter === "followers" && paramId) getUserFollowList(setFollowers, paramId, "followers");
  }, [paramId]);

  return (
    <div>
      <nav className={`${styles.nav} `}>
        <ul>
          <li className={styles["w-0"]}>
            <Link to={`/${paramId}/followers`}>
              <div className={`${styles.tab} ${location.pathname.split("/").slice(-1)[0] === "followers" && "active"}`}>
                <div className={styles.box}>
                  <p>팔로워</p>
                  {location.pathname.split("/").slice(-1)[0] === "followers" && <div className="active-bar" />}
                </div>
              </div>
            </Link>
          </li>
          <li className={styles["w-0"]}>
            <Link to={`/${paramId}/following`}>
              <div className={`${styles.tab} ${location.pathname.split("/").slice(-1)[0] === "following" && "active"}`}>
                <div className={styles.box}>
                  <p>팔로잉</p>
                  {location.pathname.split("/").slice(-1)[0] === "following" && <div className="active-bar" />}
                </div>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
      {filter === "following" && paramId ? (
        <>
          {following.map((follow) => {
            return <Person key={follow.id} user={follow} uid={uid} />;
          })}
        </>
      ) : (
        <>
          {followers.map((follow) => {
            return <Person key={follow.id} user={follow} uid={uid} />;
          })}
        </>
      )}
    </div>
  );
};

export default FollowList;
