import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { User } from "firebase/auth";
import { RiMoreFill, RiNotification2Line } from "react-icons/ri";
import { FaHashtag } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { HiOutlineBookmark } from "react-icons/hi";

import { BiUser } from "react-icons/bi";

function LeftBar({ userObj }: { userObj: User | null }) {
  const location = useLocation();
  
  return (
    <div className="leftbar-container">
      <div>
        <div className="logo-box">
          <Link to="/">
            <FontAwesomeIcon icon={faTwitter} className="logo" size="2xl" />
          </Link>
        </div>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">
                <div className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
                  <AiFillHome className="nav-icon" />
                  <span>홈</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/explore">
                <div className={`nav-item ${location.pathname === "/explore" ? "active" : ""}`}>
                  <FaHashtag className="nav-icon" />
                  <span>
                    <b>탐색하기</b>
                  </span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/notifications">
                <div className={`nav-item ${location.pathname === "/notifications" ? "active" : ""}`}>
                  <RiNotification2Line className="nav-icon" />
                  <span>알림</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/bookmarks">
                <div className={`nav-item ${location.pathname === "/bookmarks" ? "active" : ""}`}>
                  <HiOutlineBookmark className="nav-icon" />
                  <span>북마크</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/profile">
                <div className={`nav-item ${location.pathname === "/profile" ? "active" : ""}`}>
                  <BiUser className="nav-icon" />
                  <span>프로필</span>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
        <button className="btn medium">트윗하기</button>
      </div>
      <Link to="/profile">
        <div className="profile-box">
          <div className="profile-img ">
            <img src={userObj?.photoURL ? userObj.photoURL : "img/default_profile.png"} alt="userImg"></img>
          </div>
          <div className="profile-info flex">
            <div className="profile-item flex">
              <h3>{userObj?.displayName}</h3>
            </div>
            <div className="profile-item flex">
              <p>@{userObj?.email?.split("@")[0]}</p>
            </div>
          </div>
          <div className="more-box right">
            <RiMoreFill className="icon" />
          </div>
        </div>
      </Link>
    </div>
  );
}

export default LeftBar;
