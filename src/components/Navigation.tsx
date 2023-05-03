import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { User } from "firebase/auth";

const Navigation = ({ userObj, setMode }: { userObj: User | null; setMode: React.Dispatch<React.SetStateAction<string>> }) => {
  const onClick = () => {
    setMode('light');
  };
  return (
    <nav>
      <ul style={{ display: "flex", justifyContent: "center", paddingTop: 50 }}>
        <li>
          <Link to="/" style={{ marginRight: 10 }}>
            <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="2x" />
          </Link>
        </li>
        <li>
          <Link to="/profile" title={userObj?.displayName as string} className="profileLink">
            <FontAwesomeIcon icon={faUser} color={"#04AAFF"} size="2x" />
            {/* <span style={{ marginLeft: 50 }}>
              {userObj.displayName
                ? `${userObj.displayName}`
                : "Profile"}
            </span> */}
          </Link>
        </li>
        <li>
          <button onClick={onClick}>ON</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
