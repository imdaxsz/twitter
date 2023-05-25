import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { follow, unFollow } from "hooks/follow";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

export interface PersonType {
  id: string;
  name: string;
  profileImg: string | null;
  bio?: string;
}

export interface PersonProps {
  user: PersonType;
  uid: string;
  followList: PersonType[];
}

const Person = ({ user, uid, followList }: PersonProps) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user);

  const initState = currentUser.following.findIndex((following) => following.id === user.id) >= 0;
  const [following, setFollowing] = useState(initState);
  const [btnText, setBtnText] = useState(0);

  const onClick = () => {
    navigate(`/${user.id}`);
  };

  const onFollowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    follow(uid, user, currentUser, currentUser.following);
    setFollowing(true);
  };

  const onUnfollowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    unFollow(uid, user, currentUser, currentUser.following);
    setFollowing(false);
  };

  useEffect(() => {
    if (currentUser.following.findIndex((following) => following.id === user.id) >= 0) setFollowing(true);
    else setFollowing(false);
  }, [currentUser.following]);

  return (
    <div className="flex w1 p1 people-container" onClick={onClick}>
      <div className="user-img">
        <img referrerPolicy="no-referrer" src={user.profileImg ? user.profileImg : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userImg"></img>
      </div>
      <div className="people-content">
        <div className="people-top flex">
          <div className="h1">
            <div className="flex flex-item underline">
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

export default Person;
