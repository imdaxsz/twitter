import { useLocation, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import styles from "styles/topbar.module.css";
import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { dbService } from "fBase";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

function TopBar({ title, uid }: { title: string; uid: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  
  const onClick = () => {
    navigate(-1);
  };
  return (
    <div className={styles.container}>
      {["profile", "connect_people"].includes(location.pathname.split("/")[1]) ? (
        <div className={styles["icon-box"]}>
          <div className={styles.hover} onClick={onClick}>
            <MdKeyboardBackspace className={styles.icon} />
          </div>
        </div>
      ) : null}
      <div className="flex-col">
        <h3>{title}</h3>
        {title === "북마크" ? <p>@{user.id}</p> : null}
        {location.pathname === "/profile" ? <p>{0} 트윗</p> : null}
      </div>
    </div>
  );
}

export default TopBar;
