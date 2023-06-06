import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { changeProfile } from "store/userSlice";
import Loading from "./Loading";
import ImageCropper from "./ImageCropper";
import useImageCompress from "hooks/imageCompress";
import { v4 as uuidv4 } from "uuid";
import { doc, updateDoc } from "firebase/firestore";
import { auth, dbService, storageService } from "fBase";
import { deleteObject, getDownloadURL, ref, uploadString } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useMediaQuery } from "react-responsive";
import { VscClose, VscChromeClose } from "react-icons/vsc";
import { TbCameraPlus } from "react-icons/tb";
import { MdKeyboardBackspace } from "react-icons/md";
import { handleCompressImage } from "utils/imageProcess";
import md from "styles/modal.module.css";

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
      handleCompressImage(compressImage, newProfile, setNewProfile);
    }
    if (newHeader !== user.headerImg) {
      handleCompressImage(compressImage, newHeader, setNewHeader);
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
      <div className={md.wrapper} onClick={onOutsideClick}>
        <form onSubmit={onSubmit}>
          <div className={`${md.modal} ${md.shadow}`} onClick={(e) => e.stopPropagation()}>
            <div className={`${md.top} flex`}>
              <div className={md.icon} onClick={onCloseClick}>
                {!isMobile ? <VscClose className={md.svg} /> : <MdKeyboardBackspace className={md.svg} />}
              </div>
              <span>프로필 수정</span>
              <button className="btn xs black">저장</button>
            </div>
            <div className={md.header}>
              <div className={md.darken} />
              <div className={md["edit-img-box"]}>
                <div className={md["edit-img"]} onClick={onHeaderClick}>
                  <TbCameraPlus className={md["edit-icon"]} />
                </div>
                {newHeader && (
                  <div className={`${md["edit-img"]} ${md.del}`}>
                    <VscChromeClose className={md["edit-icon"]} onClick={onDeleteHeaderClick} />
                  </div>
                )}
              </div>
              {newHeader && <img src={newHeader} alt="headerImg"></img>}
            </div>
            <div className={md["modal-profile"]}>
              <div className={md["profile-img-box"]}>
                <div className={`${md.darken} ${md["rd-100"]}`}></div>
                <div className={md["edit-img-box"]}>
                  <div className={md["edit-img"]} onClick={onProfileClick}>
                    <TbCameraPlus className={md["edit-icon"]} />
                  </div>
                </div>
                <img className={md.profile} referrerPolicy="no-referrer" src={newProfile ? newProfile : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userImg"></img>
              </div>
            </div>
            <div className={`p1 ${md["mt-80"]} ${md.input}`}>
              <label htmlFor="name">
                <div className={md["input-box"]}>
                  <div className={`${md.label} ${newName === "" && md.default}`}>
                    <span>이름</span>
                  </div>
                  <div className={md["input-container"]}>
                    <input id="name" type="text" value={newName} onChange={onNameChange}></input>
                  </div>
                </div>
              </label>
            </div>
            <div className={`p1 ${md.textarea}`}>
              <label htmlFor="introduce">
                <div className={md["input-box"]}>
                  <div className={`${md.label} ${newBio === "" && md.default}`}>
                    <span>자기소개</span>
                  </div>
                  <div className={md["textarea-container"]}>
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
