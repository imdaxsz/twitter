import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Person from "components/Person";
import { getUserFollowList, getUserFollowIdList } from "utils/getUsers";
import { PersonType } from "types/types";

const FollowList = ({ uid, filter }: { uid: string; filter: string }) => {
  const { pathname } = useLocation();
  const { id: paramId } = useParams();
  const [followingList, SetFollowingList] = useState<string[]>([]);
  const [followerList, SetFollowerList] = useState<string[]>([]);
  const [following, setFollowing] = useState<PersonType[]>([]);
  const [followers, setFollowers] = useState<PersonType[]>([]);

  useEffect(() => {
    if (filter === "following" && paramId) {
      getUserFollowIdList(SetFollowingList, paramId, "following");
      getUserFollowList(followingList, setFollowing);
    } else if (filter === "followers" && paramId) {
      getUserFollowIdList(SetFollowerList, paramId, "followers");
      getUserFollowList(followerList, setFollowers);
    }
  }, []);

  useEffect(() => {
    if (filter === "following") {
      getUserFollowList(followingList, setFollowing);
    } else if (filter === "followers") {
      getUserFollowList(followerList, setFollowers);
    }
  }, [followingList.length, followerList.length]);

  return (
    <div>
      <nav className="nav nav-fix">
        <ul>
          <li className="w-50">
            <Link to={`/${paramId}/followers`}>
              <div className={`tab ${pathname.split("/").slice(-1)[0] === "followers" && "active"}`}>
                <div className="tab-box">
                  <p>팔로워</p>
                  {pathname.split("/").slice(-1)[0] === "followers" && <div className="active-bar" />}
                </div>
              </div>
            </Link>
          </li>
          <li className="w-50">
            <Link to={`/${paramId}/following`}>
              <div className={`tab ${pathname.split("/").slice(-1)[0] === "following" && "active"}`}>
                <div className="tab-box">
                  <p>팔로잉</p>
                  {pathname.split("/").slice(-1)[0] === "following" && <div className="active-bar" />}
                </div>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="list-container">
        {filter === "following" && paramId ? (
          <>
            {following.map((follow) => {
              return <Person key={follow.id} user={follow} uid={uid} />;
            })}
          </>
        ) : (
          <>
            {followers.map((follow) => {
              return <Person key={follow.id} user={follow} uid={uid} />;
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default FollowList;
