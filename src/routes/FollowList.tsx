import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Person from "components/Person";
import { getUserFollowList, getUserFollowIdList } from "utils/getUsers";
import { PersonType } from "types/types";

const FollowList = ({ uid }: { uid: string }) => {
  const pathname = useLocation().pathname.split("/").slice(-1)[0];
  const { id: paramId } = useParams();
  const [followingList, SetFollowingList] = useState<string[]>([]);
  const [followerList, SetFollowerList] = useState<string[]>([]);
  const [following, setFollowing] = useState<PersonType[]>([]);
  const [followers, setFollowers] = useState<PersonType[]>([]);

  useEffect(() => {
    if (pathname === "following" && paramId) {
      getUserFollowIdList(SetFollowingList, paramId, "following");
      getUserFollowList(followingList, setFollowing);
    } else if (pathname === "followers" && paramId) {
      getUserFollowIdList(SetFollowerList, paramId, "followers");
      getUserFollowList(followerList, setFollowers);
    }
    return () => {
      setFollowers([]);
      setFollowing([]);
    };
  }, [pathname, followerList.length, followingList.length]);

  return (
    <div>
      <nav className="nav nav-fix">
        <ul>
          <li className="w-50">
            <Link to={`/${paramId}/followers`}>
              <div className={`tab ${pathname === "followers" && "active"}`}>
                <div className="tab-box">
                  <p>팔로워</p>
                  {pathname === "followers" && <div className="active-bar" />}
                </div>
              </div>
            </Link>
          </li>
          <li className="w-50">
            <Link to={`/${paramId}/following`}>
              <div className={`tab ${pathname.split("/").slice(-1)[0] === "following" && "active"}`}>
                <div className="tab-box">
                  <p>팔로잉</p>
                  {pathname === "following" && <div className="active-bar" />}
                </div>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="list-container">
        {pathname === "following" && paramId ? (
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
