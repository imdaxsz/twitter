import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { changeProfile } from "store/userSlice";
import Loading from "./Loading";
import ImageCropper from "./ImageCropper";
import useImageCompress from "hooks/imageCompress";
import { dataURItoFile } from "../utils/common";
import { v4 as uuidv4 } from "uuid";
import { doc, updateDoc } from "firebase/firestore";
import { auth, dbService, storageService } from "fBase";
import { deleteObject, getDownloadURL, ref, uploadString } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useMediaQuery } from "react-responsive";
import { VscClose, VscChromeClose } from "react-icons/vsc";
import { TbCameraPlus } from "react-icons/tb";
import { MdKeyboardBackspace } from "react-icons/md";

interface EditProps {
  uid: string;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditProfile({ uid, setModal }: EditProps) {
  const user = useSelector((state: RootState) => state.user);
  const [newName, setNewName] = useState(user.name);
  const [newBio, setNewBio] = useState(user.bio);
  const [newHeader, setNewHeader] = useState(user.headerImg);
  const [newProfile, setNewProfile] = useState(user.profileImg);

  const userRef = doc(dbService, "users", uid);
  const dispatch = useDispatch();

  const [headerModal, setHeaderModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const compressImage = useImageCompress().compressImage;

  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 499 });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      setLoading(false);
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleCompressImage = async (newFile: string | null, option: string) => {
    let imageFile: File;
    let compressedImage;
    if (newFile) {
      imageFile = dataURItoFile(newFile);
      compressedImage = await compressImage(imageFile);
    }

    if (!compressedImage) return;
    const reader = new FileReader();
    reader.readAsDataURL(compressedImage); //data_url
    reader.onloadend = (finishedEvent) => {
      // console.log(finishedEvent);
      if (finishedEvent.target && typeof finishedEvent.target.result == "string") {
        if (option === "profile") setNewProfile(finishedEvent.target.result);
        else if (option === "header") setNewHeader(finishedEvent.target.result);
        console.log("p: ", newProfile);
        // console.log("h: ", newHeader);
      }
    };
  };

  const onProfileClick = () => {
    setProfileModal(true);
    setHeaderModal(false);
  };

  const onHeaderClick = () => {
    setHeaderModal(true);
    setProfileModal(false);
  };

  const onDeleteHeaderClick = () => {
    setNewHeader(null);
  };

  useEffect(() => {
    if (newProfile !== user.profileImg) {
      handleCompressImage(newProfile, "profile");
    }
    if (newHeader !== user.headerImg) {
      handleCompressImage(newHeader, "header");
    }
  }, [newProfile, newHeader]);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const onBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewBio(e.target.value);
  };

  const handleUploadImage = (image: string) => {
    setNewProfile(image);
  };

  const handleUploadImage2 = (image: string) => {
    setNewHeader(image);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    let profileUrl = user.profileImg;
    let headerUrl: string | null = null;

    if (newHeader) headerUrl = user.headerImg;

    if (newProfile && newProfile !== user.profileImg) {
      if (user.profileImg) {
        // 기존 이미지 저장소에서 삭제
        try {
          const urlRef = ref(storageService, user.profileImg);
          console.log(urlRef);
          await deleteObject(urlRef);
        } catch {
          console.log("저장소에 기존 이미지 없음");
        }
      }
      const attachmentRef = ref(storageService, `${uid}/${uuidv4()}`);
      const response = await uploadString(attachmentRef, newProfile, "data_url");
      profileUrl = await getDownloadURL(response.ref);
    }

    if (newHeader && newHeader !== user.headerImg) {
      if (user.headerImg) {
        // 기존 이미지 저장소에서 삭제
        try {
          const urlRef = ref(storageService, user.headerImg);
          console.log(urlRef);
          await deleteObject(urlRef);
        } catch {
          console.log("저장소에 기존 이미지 없음");
        }
      }
      const attachmentRef = ref(storageService, `${uid}/${uuidv4()}`);
      const response = await uploadString(attachmentRef, newHeader, "data_url");
      headerUrl = await getDownloadURL(response.ref);
    }

    await updateDoc(userRef, { name: newName, bio: newBio, profileImg: profileUrl, headerImg: headerUrl });
    dispatch(changeProfile({ name: newName, bio: newBio, profileImg: profileUrl, headerImg: headerUrl }));

    if (auth.currentUser) {
      updateProfile(auth.currentUser, {
        displayName: newName,
        photoURL: profileUrl,
      });
    }
    setModal(false);
  };

  const onCloseClick = () => {
    setModal(false);
  };

  const onOutsideClick = () => {
    if (!profileModal && !headerModal) setModal(false);
  };

  return (
    <>
      <Loading loading={loading} />
      {profileModal && <ImageCropper aspectRatio={1 / 1} onCrop={handleUploadImage} modal={profileModal} setModal={setProfileModal}></ImageCropper>}
      {headerModal && <ImageCropper aspectRatio={3 / 1} onCrop={handleUploadImage2} modal={headerModal} setModal={setHeaderModal}></ImageCropper>}
      <div className="modal-wrapper" onClick={onOutsideClick}>
        <form onSubmit={onSubmit}>
          <div className="modal modal-shadow" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top flex">
              <div className="modal-icon" onClick={onCloseClick}>
                {!isMobile ? <VscClose className="modal-svg" /> : <MdKeyboardBackspace className="modal-svg" />}
              </div>
              <span>프로필 수정</span>
              <button className="btn xs black">저장</button>
            </div>
            <div className="modal-header">
              <div className="darken" />
              <div className="edit-img-box">
                <div className="edit-img" onClick={onHeaderClick}>
                  <TbCameraPlus className="edit-icon" />
                </div>
                {newHeader && (
                  <div className="edit-img del">
                    <VscChromeClose className="edit-icon" onClick={onDeleteHeaderClick} />
                  </div>
                )}
              </div>
              {newHeader && <img src={newHeader} alt="headerImg"></img>}
            </div>
            <div className="modal-img-box">
              <div className="modal-profile-img">
                <div className="darken radius-100"></div>
                <div className="edit-img-box">
                  <div className="edit-img" onClick={onProfileClick}>
                    <TbCameraPlus className="edit-icon" />
                  </div>
                </div>
                <img className="profile-img" referrerPolicy="no-referrer" src={newProfile ? newProfile : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userImg"></img>
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
      </div>
    </>
  );
}

export default EditProfile;
