import FollowRecommend from "./FollowRecommend";
import SearchBar from "./SearchBar";
import { Link, useLocation } from "react-router-dom";
import styles from "styles/rightbar.module.css";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { useEffect, useState } from "react";
import { getUsers } from "hooks/getUsers";
import { PersonType } from "./Person";

function RightBar({ uid }: { uid: string }) {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user);
  const [users, setUsers] = useState<PersonType[]>([]);

  useEffect(() => {
    getUsers(setUsers, user.id, 3);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {!["explore", "search"].includes(location.pathname.split("/")[1]) && <SearchBar />}
        <div className={styles.follow}>
          <div className={styles.title}>
            <h3>팔로우 추천</h3>
          </div>
          {users.map((u) => {
            return <FollowRecommend key={u.id} user={u} uid={uid} />;
          })}
          {users.length > 0 && (
            <Link to="connect_people">
              <div className={styles.more}>
                <p>더보기</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default RightBar;
