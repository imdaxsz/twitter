import { useNavigate } from "react-router-dom";

export interface PeopleType {
  id: string;
  name: string;
  profileImg: string | null;
  bio?: string;
}

const People = ({ id, name, profileImg, bio }: PeopleType) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/profile/${id}`);
  };

  const onFollowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // follow / unfollow 하기
    console.log("test");
  };

  return (
    <div className="flex w1 p1 people-container" onClick={onClick}>
      <div className="user-img">
        <img referrerPolicy="no-referrer" src={profileImg ? profileImg : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userImg"></img>
      </div>
      <div className="people-content">
        <div className="people-top flex">
          <div className="h1">
            <div className="flex flex-item">
              <h4>{name}</h4>
            </div>
            <div className="flex flex-item">
              <p>@{id}</p>
            </div>
          </div>
          <button className="btn xs black" onClick={onFollowClick}>
            팔로우
          </button>
        </div>
        {bio && (
          <div className="people-bio flex">
            <span>{bio}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default People;
