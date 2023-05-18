import { deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { dbService, storageService } from "fBase";
import { deleteObject, ref } from "firebase/storage";
import React, { useState, useEffect } from "react";
import { RiMoreFill } from "react-icons/ri";
import { TbMessageCircle2 } from "react-icons/tb";
import { RiHeart3Line } from "react-icons/ri";
import { FiBookmark } from "react-icons/fi";
import { AiOutlineRetweet, AiFillEdit } from "react-icons/ai";
import { CgTrash } from "react-icons/cg";
import styles from "styles/tweet.module.css";

export interface TweetType {
  id: string;
  text: string;
  createdAt: number;
  creatorId: string | undefined;
  creatorUid: string;
  attachmentUrl: string;
  likes: number;
  retweets: number;
  replies: string[];
}

interface TweetProps {
  tweetObj: TweetType;
  isOwner: boolean;
  // userImg: string;
}

function Tweet({ tweetObj, isOwner }: TweetProps) {
  const tweetTextRef = doc(dbService, "tweets", `${tweetObj.id}`);
  const urlRef = ref(storageService, tweetObj.attachmentUrl);

  // const [editing, setEditing] = useState(false);
  // const [newTweet, setNewTweet] = useState(tweetObj.text);

  const [more, setMore] = useState(false);
  const [userImg, setUserImg] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    getuserImg(tweetObj.creatorUid);
  }, []);

  const getuserImg = (uid: string) => {
    onSnapshot(doc(dbService, "profiles", uid), (doc) => {
      if (doc.exists()) {
        setUserImg(doc.data().profileImg);
        setName(doc.data().name);
      }
    });
  };

  const onDeleteClick = async () => {
    const ok = window.confirm("트윗을 삭제할까요?");
    if (ok) {
      await deleteDoc(tweetTextRef);
      if (tweetObj.attachmentUrl !== "") {
        await deleteObject(urlRef);
      }
    }
  };

  const onMoreClick = () => {
    setMore(true);
  };

  const onMoreBlur = () => {
    setTimeout(() => setMore(false), 100);
  };

  // const toggleEditing = () => setEditing((prev) => !prev);

  // const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   await updateDoc(tweetTextRef, { text: newTweet });
  //   setEditing(false);
  // };

  // const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewTweet(e.target.value);

  return (
    <div className={styles.tweet}>
      {more && (
        <div className="more-modal modal-shadow">
          <div className="more-item-box">
            <div className="more-item">
              <AiFillEdit className="icon" />
              <h4>수정하기</h4>
            </div>
          </div>
          <div className="more-item-box" onClick={onDeleteClick}>
            <div className="more-item red">
              <CgTrash className="icon red" />
              <h4>삭제하기</h4>
            </div>
          </div>
        </div>
      )}
      <div className={styles["user-img"]}>
        <img src={userImg !== "" ? userImg : "img/default_profile.png"} alt="userImg"></img>
      </div>
      <div className={styles.content}>
        <div className="flex mb-2">
          <div className={`${styles.info} flex`}>
            <div className={styles["user-name"]}>
              {/* <h4>{tweetObj.creatorName}</h4> */}
              <h4>{name}</h4>
            </div>
            <div className={styles["user-id"]}>
              <p>{tweetObj.creatorId}</p>
            </div>
          </div>
          {isOwner && (
            <button title="더 보기" className="twticon-box more blue" onFocus={onMoreClick} onBlur={onMoreBlur}>
              <RiMoreFill className="icon" />
            </button>
          )}
        </div>
        {tweetObj.text !== "" && (
          <div className={styles.text}>
            <h4>{tweetObj.text}</h4>
          </div>
        )}
        {tweetObj.attachmentUrl !== "" && (
          <div className={styles.twtimg}>
            <img src={tweetObj.attachmentUrl} alt={tweetObj.attachmentUrl} />
          </div>
        )}
        {/* <div style={{ clear: "both" }}></div> */}
        <div className={styles.icons}>
          <div title="답글" className={`twticon-box blue ${styles.twt} ${styles["l-1"]}`}>
            <TbMessageCircle2 className="icon" />
          </div>
          <div title="리트윗" className={`twticon-box green ${styles.twt} ${styles["l-2"]}`}>
            <AiOutlineRetweet className="icon" />
          </div>
          <div title="마음에 들어요" className={`twticon-box pink ${styles.twt} ${styles["l-3"]}`}>
            <RiHeart3Line className="icon" />
          </div>
          <div title="북마크" className={`twticon-box blue ${styles.twt} ${styles["l-4"]}`}>
            <FiBookmark className="icon" />
          </div>
        </div>
      </div>
      {/* <>
        <h4>{tweetObj.text}</h4>
        {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl} alt={tweetObj.attachmentUrl} />}
        {isOwner && (
          <div className="tweet__actions">
            <span onClick={onDeleteClick}>
              <FontAwesomeIcon icon={faTrash} />
            </span> */}
      {/* <span onClick={toggleEditing}>
              <FontAwesomeIcon icon={faPencilAlt} />
            </span> */}
      {/* </div>
        )}
      </> */}
      {/* {editing ? (
        <>
          <form onSubmit={onSubmit} className="container tweetEdit">
            <input type="text" placeholder="Edit your tweet" value={newTweet} required autoFocus onChange={onChange} className="formInput" />
            <input type="submit" value="Update Tweet" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : ( */}
    </div>
  );
}

export default Tweet;
