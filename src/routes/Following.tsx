import Person from "components/Person";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { RootState } from "store/store";
import styles from "styles/profile.module.css";

const Following = ({ uid }:{uid:string}) => {
  const location = useLocation();
  const { id: paramId } = useParams();

  const {following} = useSelector((state: RootState) => state.user);

  return (
    <div>
      <nav className={`${styles.nav} `}>
        <ul>
          <li className={styles["w-0"]}>
            <Link to={`/profile/${paramId}/followers`}>
              <div className={`${styles.tab} ${location.pathname.split("/").slice(-1)[0] === "followers" && "active"}`}>
                <div className={styles.box}>
                  <p>팔로워</p>
                  {location.pathname.split("/").slice(-1)[0] === "followers" && <div className="active-bar" />}
                </div>
              </div>
            </Link>
          </li>
          <li className={styles["w-0"]}>
            <Link to={`/profile/${paramId}/following`}>
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
      {following.map((follow) => {
        return <Person key={follow.id} user={follow} uid={uid} followingList={following} />;
      })}
    </div>
  );
};

export default Following;
