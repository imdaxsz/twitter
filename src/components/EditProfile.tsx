import React, { useState, useEffect } from "react";
import { VscClose } from "react-icons/vsc";
import { doc, updateDoc } from "firebase/firestore";
import { dbService } from "fBase";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { ProfileState, changeProfile } from "store/userSlice";

interface EditProps {
  uid: string;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditProfile({ uid, setModal }: EditProps) {
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newHeader, setNewHeader] = useState("");
  const [newProfile, setNewProfile] = useState("");

  const userRef = doc(dbService, "users", uid);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setNewBio(user.bio);
    setNewName(user.name);
    setNewHeader(user.headerImg);
    setNewProfile(user.profileImg);
  }, []);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const onBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewBio(e.target.value);
  };
  
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateDoc(userRef, { bio: newBio, name: newName });
    const newData: ProfileState = {
      name: newName,
      bio: newBio,
      profileImg: user.profileImg,
      headerImg: user.headerImg,
    }
    dispatch(changeProfile(newData));
    setModal(false);
  };

  const onCloseClick = () => {
    setModal(false);
  }

  return (
    <form className="modal-wrapper" onSubmit={onSubmit}>
      <div className="modal modal-shadow">
        <div className="modal-top flex">
          <div className="modal-icon" onClick={onCloseClick}>
            <VscClose className="modal-svg" />
          </div>
          <span>프로필 수정</span>
          <button className="btn xs black">저장</button>
        </div>
        <div className="modal-header">
          <div className="darken" />
          {newHeader === "" && <img src="img/test.jpg" alt="headerImg"></img>}
        </div>
        <div className="modal-img-box">
          <div className="modal-profile-img">
            <div className="darken radius-100"></div>
            <img src={newProfile !== "" ? newProfile : "img/default_profile.png"} alt="userImg"></img>
            {/* <img src="img/profile.jpg" alt="userImg"></img> */}
          </div>
        </div>
        <div className="p1 mt-50 modal-input">
          <label htmlFor="name">
            <div className="modal-input-box">
              <div className={"input-label " + (newName === "" ? "md-label" : "")}>
                <span>이름</span>
              </div>
              <div className="input-container">
                <input id="name" type="text" value={newName} onChange={onNameChange}></input>
              </div>
            </div>
          </label>
        </div>
        <div className="p1 modal-textarea">
          <label htmlFor="introduce">
            <div className="modal-input-box">
              <div className={"input-label " + (newBio === "" ? "md-label" : "")}>
                <span>자기소개</span>
              </div>
              <div className="textarea-container">
                <textarea id="introduce" value={newBio} onChange={onBioChange}></textarea>
              </div>
            </div>
          </label>
        </div>
      </div>
    </form>
  );
}

export default EditProfile;
