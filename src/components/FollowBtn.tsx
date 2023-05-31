import { useState, useEffect } from "react";
import { UserState } from "store/userSlice";
import { PersonType } from "types/types";
import { follow, unFollow } from "utils/follow";

interface FollowBtnProps {
  uid: string;
  user: PersonType;
  currentUser: UserState;
} 

const FollowBtn = ({ uid, user, currentUser}: FollowBtnProps) => {
  const initState = currentUser.following.findIndex((following) => following.id === user.id) >= 0;
  const [following, setFollowing] = useState(initState);
  const [btnText, setBtnText] = useState(0);

  const currentUserProps:PersonType = {
    id: currentUser.id,
    name: currentUser.name,
    bio: currentUser.bio,
    profileImg: currentUser.profileImg
  }

  const onFollowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    follow(uid, user, currentUserProps, currentUser.following);
    setFollowing(true);
  };

  const onUnfollowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    unFollow(uid, user, currentUserProps, currentUser.following);
    setFollowing(false);
    setBtnText(0);
  };

  useEffect(() => {
    if (currentUser.following.findIndex((following) => following.id === user.id) >= 0) setFollowing(true);
    else setFollowing(false);
  }, [currentUser.following]);

  return (
    <>
      {following ? (
        <button className="btn xs btn-white" onMouseEnter={() => setBtnText(1)} onMouseLeave={() => setBtnText(0)} onClick={onUnfollowClick}>
          {btnText === 0 ? "팔로잉" : "언팔로우"}
        </button>
      ) : (
        <button className="btn xs black" onClick={onFollowClick}>
          팔로우
        </button>
      )}
    </>
  );
};

export default FollowBtn;