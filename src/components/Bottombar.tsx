import { AiFillHome } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { RiNotification2Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "store/store";
import styles from "styles/bottombar.module.css";

const Bottombar = () => {
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link to="/">
              <div className={`${styles["nav-item"]} ${location.pathname === "/" && styles.active}`}>
                <AiFillHome className={styles["nav-icon"]} />
              </div>
            </Link>
          </li>
          <li>
            <Link to="/explore">
              <div className={`${styles["nav-item"]} ${location.pathname === "/explore" && styles.active}`}>
                <FiSearch className={styles["nav-icon"]} />
              </div>
            </Link>
          </li>
          <li>
            <Link to="/notifications">
              <div className={`${styles["nav-item"]} ${location.pathname === "/notifications" && styles.active}`}>
                <RiNotification2Line className={styles["nav-icon"]} />
              </div>
            </Link>
          </li>
          <li>
            <Link to={`/${user.id}`}>
              <div className={styles["profile-img"]}>
                <img referrerPolicy="no-referrer" src={user.profileImg ? user.profileImg : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userimg"></img>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Bottombar;
