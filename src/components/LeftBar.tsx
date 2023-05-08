import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import { User } from "firebase/auth";
import { ReactComponent as HomeIcon } from "../svg/home_icon.svg";
import { ReactComponent as ExploreIcon } from "../svg/9073909_hashtag_icon.svg";
import { ReactComponent as BookMarkIcon } from "../svg/bookmark_icon.svg";
import { ReactComponent as NotiIcon } from "../svg/notification_icon.svg";
import { ReactComponent as ProfileIcon } from "../svg/profile_icon.svg";

function LeftBar({ userObj }: { userObj: User | null }) {
  return (
    <div className="leftbar-container">
      <div className="logo-box">
        <Link to="/">
          <FontAwesomeIcon icon={faTwitter} className="logo" size="2xl" />
        </Link>
      </div>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">
              <div className="nav-item">
                {/* <FontAwesomeIcon icon={faHouse} /> */}
                <HomeIcon className="nav-icon" />
                <span>홈</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/explore">
              <div className="nav-item">
                {/* <FontAwesomeIcon icon={faHashtag} /> */}
                <ExploreIcon className="nav-icon" />
                <span>탐색하기</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/notifications">
              <div className="nav-item">
                {/* <FontAwesomeIcon icon={faHouseChimneyWindow} /> */}
                <NotiIcon className="nav-icon" />
                <span>알림</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/bookmarks">
              <div className="nav-item">
                {/* <FontAwesomeIcon icon={faHouseChimneyWindow} /> */}
                <BookMarkIcon className="nav-icon" />
                <span>북마크</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <div className="nav-item">
                {/* <FontAwesomeIcon icon={faUser} />/ */}
                <ProfileIcon className="nav-icon" />
                <span>프로필</span>
              </div>
            </Link>
          </li>
          <button className="formBtn">트윗하기</button>
          <Link to="/profile" title={userObj?.displayName as string}>
            <div>
              
            </div>
          </Link>
        </ul>
      </nav>
    </div>
  );
}

export default LeftBar;
