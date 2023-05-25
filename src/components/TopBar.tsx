import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import styles from "styles/topbar.module.css";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

function TopBar({ title, uid }: { title: string; uid: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const count = useSelector((state: RootState) => state.tweetCount);
  const { id: paramId, tweetId } = useParams();
  
  const onClick = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      {[paramId, "connect_people"].includes(location.pathname.split("/")[1]) ? (
        <div className={styles["icon-box"]}>
          <div className={styles.hover} onClick={onClick}>
            <MdKeyboardBackspace className={styles.icon} />
          </div>
        </div>
      ) : null}
      <div className="flex-col">
        <h3>{title}</h3>
        {title === "북마크" ? <p>@{user.id}</p> : null}
        {paramId && !tweetId ? <p>{count.value} 트윗</p> : null}
      </div>
    </div>
  );
}

export default TopBar;
