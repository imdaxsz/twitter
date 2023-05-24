import { deleteDoc, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { dbService, storageService } from "fBase";
import { deleteObject, ref } from "firebase/storage";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEditObj, setModal } from "store/EditSlice";
import { RootState } from "store/store";
import { Link } from "react-router-dom";
import { RiHeart3Fill, RiHeart3Line, RiMoreFill } from "react-icons/ri";
import { TbMessageCircle2 } from "react-icons/tb";
import { FiBookmark } from "react-icons/fi";
import { AiOutlineRetweet, AiFillEdit } from "react-icons/ai";
import { FaBookmark } from "react-icons/fa";
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
  uid: string;
}

function Tweet({ tweetObj, uid }: TweetProps) {
  const tweetTextRef = doc(dbService, "tweets", `${tweetObj.id}`);
  const urlRef = ref(storageService, tweetObj.attachmentUrl);
  const userRef = doc(dbService, "users", uid);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [more, setMore] = useState(false);
  const [userImg, setUserImg] = useState<string | null>(null);
  const [name, setName] = useState("");

  const [like, setLike] = useState(false);
  const [bookmark, setBookmark] = useState(false);

  useEffect(() => {
    getuserImg(tweetObj.creatorUid);
  }, []);

  const getuserImg = (uid: string) => {
    onSnapshot(doc(dbService, "users", uid), (doc) => {
      if (doc.exists()) {
        setUserImg(doc.data().profileImg);
        setName(doc.data().name);
      }
    });
  };

  const onImgClick = () => {
    window.open(tweetObj.attachmentUrl);
  };
  
  const onMoreClick = () => {
    setMore(true);
  };

  const onDeleteClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const ok = window.confirm("트윗을 삭제할까요?");
    if (ok) {
      await deleteDoc(tweetTextRef);
      if (tweetObj.attachmentUrl !== "") {
        await deleteObject(urlRef);
      }
    }
  };

  const onEditClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    console.log("clicked");
    dispatch(setEditObj(tweetObj));
    dispatch(setModal(true));
    setMore(false);
  };

  const onBookmarkClick = async () => {
    const docSnap = await getDoc(doc(dbService, "users", uid));
    if (docSnap.exists()) {
      const bookmarks: TweetType[] = docSnap.data().bookmarks;
      if (user.bookmarks.findIndex((tweet) => tweet.id === tweetObj.id)<0) {
        // 북마크에 없는 경우 새로 추가
        await updateDoc(userRef, { bookmarks: [tweetObj, ...bookmarks] });
        setBookmark(true);
      } else {
        // 북마크에 있는 경우 삭제
        const result = bookmarks.filter((tweet) => tweet.id !== tweetObj.id);
        await updateDoc(userRef, { bookmarks: [...result] });
        setBookmark(false);
      }
      console.log(user.bookmarks);
    }
  };


  const month = new Date(tweetObj.createdAt).getMonth() + 1;
  const date = new Date(tweetObj.createdAt).getDate();

  return (
    <>
      {more && <div className="more-modal-wrapper" onClick={() => setMore(false)}></div>}
      <div className={styles.tweet}>
        {more && (
          <div className="more-modal modal-shadow">
            <div className="more-item-box p1" onClick={onEditClick}>
              <div className="more-item">
                <AiFillEdit className="icon" />
                <h4>수정하기</h4>
              </div>
            </div>
            <div className="more-item-box p1" onClick={onDeleteClick}>
              <div className="more-item red">
                <CgTrash className="icon red" />
                <h4>삭제하기</h4>
              </div>
            </div>
          </div>
        )}
        <Link to={`profile/${tweetObj.creatorId?.slice(1)}`}>
          <div className={styles["user-img"]}>
            <img referrerPolicy="no-referrer" src={userImg ? userImg : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userImg"></img>
          </div>
        </Link>
        <div className={styles.content}>
          <div className="flex mb-2">
            <div className={`${styles.info} flex`}>
              <Link to={`profile/${tweetObj.creatorId?.slice(1)}`}>
                <div className={`line ${styles["user-name"]}`}>
                  <h4>{name}</h4>
                </div>
              </Link>
              <Link to={`profile/${tweetObj.creatorId?.slice(1)}`}>
                <div className={styles["user-id"]}>
                  <p>@{tweetObj.creatorId}</p>
                </div>
              </Link>
              <div className="p-4">
                <p>·</p>
              </div>
              <div>
                <p>
                  {month}월 {date}일
                </p>
              </div>
            </div>
            {tweetObj.creatorUid === uid && (
              <button title="더 보기" className="twticon-box more blue" onFocus={onMoreClick}>
                <RiMoreFill className="icon" />
              </button>
            )}
          </div>
          {tweetObj.text !== "" && (
            <div className={styles.text}>
              <span>{tweetObj.text}</span>
            </div>
          )}
          {tweetObj.attachmentUrl !== "" && (
            <div className={styles.twtimg} onClick={onImgClick}>
              <img src={tweetObj.attachmentUrl} alt={tweetObj.attachmentUrl} />
            </div>
          )}
          <div className={styles.icons}>
            <div title="답글" className={`twticon-box blue ${styles.twt} ${styles["l-1"]}`}>
              <TbMessageCircle2 className="icon" />
            </div>
            <div title="리트윗" className={`twticon-box green ${styles.twt} ${styles["l-2"]}`}>
              <AiOutlineRetweet className={`icon ${like && "fill"}`} />
            </div>
            <div title="마음에 들어요" className={`twticon-box pink ${styles.twt} ${styles["l-3"]}`}>
              {like ? <RiHeart3Fill className="icon fill" /> : <RiHeart3Line className="icon" />}
            </div>
            <div title="북마크" className={`twticon-box blue ${styles.twt} ${styles["l-4"]}`} onClick={onBookmarkClick}>
              {bookmark ? <FaBookmark className="icon bm fill" /> : <FiBookmark className="icon" />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tweet;
