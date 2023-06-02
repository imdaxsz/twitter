import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { RootState } from "store/store";
import { useSelector } from "react-redux";
import { auth, dbService } from "fBase";
import styles from "styles/topbar.module.css";
import { MdKeyboardBackspace } from "react-icons/md";
import { FaRegBookmark, FaTwitter } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { doc, getDoc, updateDoc } from "firebase/firestore";

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

  const onClearNotiClick = async () => {
    const ok = window.confirm("알림을 삭제할까요?");
    if (ok) {
      const notiRef = doc(dbService, "notification", user.id);
      const docSnap = await getDoc(notiRef);
      if (docSnap.exists()) {
        if (pathName.split("/").slice(-1)[0] === "notifications") await updateDoc(notiRef, { tweetNoti: [] });
        else await updateDoc(notiRef, { follow: [] });
      }
    }
  };

  const mobileHome = Boolean(title === "홈" && isMobile);
  const backSpace = Boolean([paramId, "connect_people"].includes(pathName.split("/")[1]) || (isMobile && pathName.split("/")[1] === "bookmarks"));

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
      {pathName.split("/")[1] === "notifications" && (
        <div className={`${styles["mb-icon"]} ${styles.right}`} onClick={onClearNotiClick}>
          <RiDeleteBin5Line className={styles.icon} />
        </div>
      )}
    </div>
  );
}

export default TopBar;
