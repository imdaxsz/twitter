import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { follow, unFollow } from "hooks/follow";

export interface PeopleType {
  id: string;
  name: string;
  profileImg: string | null;
  bio?: string;
}

interface PeopleProps {
  user: PeopleType;
  uid: string;
  FollowingList: PeopleType[];
}

const People = ({ user, uid, FollowingList }: PeopleProps) => {
  const navigate = useNavigate();

  const [following, setFollowing] = useState(false);
  const [btnText, setBtnText] = useState(0);

  const onClick = () => {
    navigate(`/profile/${user.id}`);
  };

  const onFollowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    follow(uid, user, FollowingList);
    setFollowing(true);
  };
  
  const onUnfollowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    unFollow(uid, user.id, FollowingList);
    setFollowing(false);
  };

  useEffect(() => {
    if (FollowingList.findIndex((following) => following.id === user.id) >= 0) setFollowing(true);
  }, [FollowingList]);

  return (
    <div className="flex w1 p1 people-container" onClick={onClick}>
      <div className="user-img">
        <img referrerPolicy="no-referrer" src={user.profileImg ? user.profileImg : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userImg"></img>
      </div>
      <div className="people-content">
        <div className="people-top flex">
          <div className="h1">
            <div className="flex flex-item">
              <h4>{user.name}</h4>
            </div>
            <div className="flex flex-item">
              <p>@{user.id}</p>
            </div>
          </div>
          {following ? (
            <button className="btn xs btn-white" onMouseEnter={() => setBtnText(1)} onMouseLeave={() => setBtnText(0)} onClick={onUnfollowClick}>
              {btnText === 0 ? "팔로잉" : "언팔로우"}
            </button>
          ) : (
            <button className="btn xs black" onClick={onFollowClick}>
              팔로우
            </button>
          )}
        </div>
        {user.bio && (
          <div className="people-bio flex">
            <span>{user.bio}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default People;
