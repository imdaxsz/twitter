import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RootState } from "store/store";
import { useSelector } from "react-redux";
import { auth } from "fBase";
import styles from "styles/topbar.module.css";
import { MdKeyboardBackspace } from "react-icons/md";
import { FaTwitter } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

function TopBar({ title, uid, isMobile }: { title: string; uid: string; isMobile?: boolean }) {
  const location = useLocation();
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

  return (
    <div className={`${styles.container} ${title === "홈" && isMobile && styles.center}`}>
      {[paramId, "connect_people"].includes(location.pathname.split("/")[1]) ? (
        <div className={styles["icon-box"]}>
          <div className={styles.hover} onClick={onClick}>
            <MdKeyboardBackspace className={styles.icon} />
          </div>
        </div>
      ) : null}
      {isMobile && title === "홈" && <FaTwitter className="sm-logo" />}
      <div className="flex-col">
        {!(isMobile && title === "홈") && <h3>{title}</h3>}
        {title === "북마크" ? <p>@{user.id}</p> : null}
        {paramId && !tweetId ? <p>{count.value} 트윗</p> : null}
      </div>
      {isMobile && location.pathname.split("/")[1] === paramId && (
        <div className={`${styles["icon-box"]} ${styles.right}`} onClick={onLogOutClick}>
          <FiLogOut className={styles.icon} />
        </div>
      )}
    </div>
  );
}

export default TopBar;
