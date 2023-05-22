import FollowRecommend from "./FollowRecommend";
import SearchBar from "./SearchBar";
import { Link, useLocation } from "react-router-dom";
import styles from "styles/rightbar.module.css";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { useEffect, useState } from "react";
import { getUsers } from "hooks/getUsers";
import { PeopleType } from "./People";

function RightBar() {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user);
  const [users, setUsers] = useState<PeopleType[]>([]);

  useEffect(() => {
    getUsers(setUsers, user.id, 3);
  }, []);

  return (
    <div className={styles.container}>
      {location.pathname !== "/explore" && <SearchBar />}
      <div className={styles.follow}>
        <div className={styles.title}>
          <h3>팔로우 추천</h3>
        </div>
        {users.map((user) => {
          return <FollowRecommend key={user.id} id={user.id} name={user.name} profileImg={user.profileImg} />;
        })}
        {users.length === 1 && (
          <Link to="connect_people">
            <div className={styles.more}>
              <p>더보기</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default RightBar;
