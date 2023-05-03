import { auth, dbCollection, dbService } from "fBase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, query, where, orderBy } from "firebase/firestore";
import { User, updateProfile } from "firebase/auth";

const Profile = ({ userObj, refreshUser }: { userObj: User | null, refreshUser: () => Promise<void> }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj?.displayName);

  const onLogOutClick = () => {
    auth.signOut();
    navigate("/");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDisplayName(e.currentTarget.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userObj && userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, { displayName: newDisplayName });
    }
    refreshUser();
  };

  const getMyTweets = async () => {
    const q = query(dbCollection(dbService, "tweets"), where("creatorId", "==", userObj?.uid), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };

  useEffect(() => {
    getMyTweets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input type="text" autoFocus placeholder="Display name" onChange={onChange} value={newDisplayName as string} className="formInput" />
        <input type="submit" value="Update Profile" className="formBtn" style={{ marginTop: 10 }} />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log out
      </span>
    </div>
  );
};

export default Profile;
