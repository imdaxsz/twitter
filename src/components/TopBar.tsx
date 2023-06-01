import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { RootState } from "store/store";
import { useSelector } from "react-redux";
import { auth } from "fBase";
import styles from "styles/topbar.module.css";
import { MdKeyboardBackspace } from "react-icons/md";
import { FaBookmark, FaRegBookmark, FaTwitter } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

function TopBar({ title, uid, isMobile }: { title: string; uid: string; isMobile?: boolean }) {
  const pathName = useLocation().pathname;
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const count = useSelector((state: RootState) => state.tweetCount);
  const { id: paramId, tweetId } = useParams();

  const onClick = () => {
    navigate(-1);
  };

  const onLogOutClick = () => {
    const ok = window.confirm("로그아웃할까요?");
    if (ok) {
      auth.signOut();
      navigate("/");
    }
  };

  const mobileHome = Boolean(title === "홈" && isMobile);
  const backSpace = Boolean([paramId, "connect_people"].includes(pathName.split("/")[1]) || (isMobile && pathName.split("/")[1] === "bookmarks"));
  console.log(backSpace);

  return (
    <div className={`${styles.container} ${mobileHome && styles.center}`}>
      {backSpace ? (
        <div className={styles["icon-box"]}>
          <div className={styles.hover} onClick={onClick}>
            <MdKeyboardBackspace className={styles.icon} />
          </div>
        </div>
      ) : null}
      {mobileHome && <FaTwitter className="sm-logo" />}
      <div className="flex-col">
        {!mobileHome && <h3>{title}</h3>}
        {title === "북마크" ? <p>@{user.id}</p> : null}
        {paramId && !tweetId ? <p>{count.value} 트윗</p> : null}
      </div>
      {isMobile && pathName.split("/")[1] === user.id && (
        <div className={`${styles["mb-icons"]}`}>
          <Link to="/bookmarks">
            <div className={`${styles["mb-icon"]}`}>
              {" "}
              <FaRegBookmark className={styles.icon} />
            </div>
          </Link>
          <div className={`${styles["mb-icon"]}`} onClick={onLogOutClick}>
            <FiLogOut className={styles.icon} />
          </div>
        </div>
      )}
    </div>
  );
}

export default TopBar;
