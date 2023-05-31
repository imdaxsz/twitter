import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "store/store";
import styles from "styles/bottombar.module.css";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { FaBell, FaRegBell, FaSearch } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";

const Bottombar = () => {
  const user = useSelector((state: RootState) => state.user);
  const pathName = useLocation().pathname;

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link to="/">
              <div className={`${styles["nav-item"]} ${pathName === "/" && styles.active}`}>{pathName === "/" ? <AiFillHome className={styles["nav-icon"]} /> : <AiOutlineHome className={styles["nav-icon"]} />}</div>
            </Link>
          </li>
          <li>
            <Link to="/explore">
              <div className={`${styles["nav-item"]} ${pathName === "/explore" && styles.active}`}>{pathName === "/explore" ? <FaSearch className={styles["nav-icon"]} /> : <BiSearch className={styles["nav-icon"]} />}</div>
            </Link>
          </li>
          <li>
            <Link to="/notifications">
              <div className={`${styles["nav-item"]} ${pathName === "/notifications" && styles.active}`}>{pathName === "/notifications" ? <FaBell className={styles["nav-icon"]} /> : <FaRegBell className={styles["nav-icon"]} />}</div>
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
