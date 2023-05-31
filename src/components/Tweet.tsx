import { deleteDoc, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { dbService, storageService } from "fBase";
import { deleteObject, ref } from "firebase/storage";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEditObj, setModal } from "store/EditSlice";
import { RootState } from "store/store";
import { useNavigate } from "react-router-dom";
import { RiHeart3Fill, RiHeart3Line, RiMoreFill } from "react-icons/ri";
import { TbMessageCircle2 } from "react-icons/tb";
import { FiBookmark } from "react-icons/fi";
import { AiOutlineRetweet, AiFillEdit } from "react-icons/ai";
import { FaBookmark } from "react-icons/fa";
import { CgTrash } from "react-icons/cg";
import styles from "styles/tweet.module.css";
import { removeLikes, removeRetweets, removeMyTweets } from "store/userSlice";

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
  mention: string;
  mentionTo: string;
}

interface TweetProps {
  tweetObj: TweetType;
  uid: string;
  paramId?: string;
  detail?: boolean;
}

function Tweet({ tweetObj, uid, paramId, detail }: TweetProps) {
  const tweetTextRef = doc(dbService, "tweets", `${tweetObj.id}`);
  const urlRef = ref(storageService, tweetObj.attachmentUrl);
  const userRef = doc(dbService, "users", uid);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [more, setMore] = useState(false);
  const [userImg, setUserImg] = useState<string | null>(null);
  const [name, setName] = useState("");

  const [retweet, setRetweet] = useState(false);
  const [like, setLike] = useState(false);
  const [bookmark, setBookmark] = useState(false);

  useEffect(() => {
    getuserImg(tweetObj.creatorUid);
  }, []);

  useEffect(() => {
    if (user.bookmarks.findIndex((id) => id === tweetObj.id) >= 0) setBookmark(true);
  }, [user.bookmarks]);

  useEffect(() => {
    if (user.likes.findIndex((id) => id === tweetObj.id) >= 0) setLike(true);
  }, [user.likes]);

  useEffect(() => {
    if (user.retweets.findIndex((id) => id === tweetObj.id) >= 0) setRetweet(true);
  }, [user.retweets]);

  const getuserImg = (uid: string) => {
    onSnapshot(doc(dbService, "users", uid), (doc) => {
      if (doc.exists()) {
        setUserImg(doc.data().profileImg);
        setName(doc.data().name);
      }
    });
  };

  const ontweetClick = () => {
    navigate(`/${tweetObj.creatorId}/status/${tweetObj.id}`);
  };

  const onUserClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigate(`/${tweetObj.creatorId}`);
  };

  const onImgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    window.open(tweetObj.attachmentUrl);
  };

  const onMoreClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMore(true);
  };

  const onDeleteClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const ok = window.confirm("트윗을 삭제할까요?");
    if (ok) {
      await deleteDoc(tweetTextRef);
      const result = user.myTweets.filter((id) => id !== tweetObj.id);
      await updateDoc(userRef, { myTweets: [...result] });
      if (tweetObj.attachmentUrl !== "") {
        await deleteObject(urlRef);
      }
      if (user.bookmarks.findIndex((id) => id === tweetObj.id) >= 0) {
        const result = user.bookmarks.filter((id) => id !== tweetObj.id);
        await updateDoc(userRef, { bookmarks: [...result] });
      }
      if (user.likes.findIndex((id) => id === tweetObj.id) >= 0) {
        const result = user.likes.filter((id) => id !== tweetObj.id);
        await updateDoc(userRef, { likes: [...result] });
      }
      if (tweetObj.mention !== "") {
        const docRef = doc(dbService, "tweets", tweetObj.mention);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const result: string[] = docSnap.data().replies.filter((id: string) => id !== tweetObj.id);
          await updateDoc(docRef, { replies: result });
        }
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

  const onBookmarkClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (user.bookmarks.findIndex((id) => id === tweetObj.id) < 0) {
      // 북마크에 없는 경우 새로 추가
      await updateDoc(userRef, { bookmarks: [...user.bookmarks, tweetObj.id] });
      setBookmark(true);
    } else {
      // 북마크에 있는 경우 삭제
      const ok = window.confirm("트윗을 북마크에서 삭제할까요?");
      if (ok) {
        const result = user.bookmarks.filter((id) => id !== tweetObj.id);
        await updateDoc(userRef, { bookmarks: [...result] });
        setBookmark(false);
      }
    }
  };

  const onRetweetClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (user.retweets.findIndex((id) => id === tweetObj.id) < 0) {
      // 리트윗
      await updateDoc(tweetTextRef, { retweets: tweetObj.retweets + 1 });
      await updateDoc(userRef, { retweets: [...user.retweets, tweetObj.id] });
      await updateDoc(userRef, { myTweets: [...user.myTweets, tweetObj.id] });
      setRetweet(true);
    } else {
      // 리트윗 취소
      const result = user.myTweets.filter((id) => id !== tweetObj.id);
      const result2 = user.retweets.filter((id) => id !== tweetObj.id);
      await updateDoc(tweetTextRef, { retweets: tweetObj.retweets - 1 });
      await updateDoc(userRef, { myTweets: [...result] });
      await updateDoc(userRef, { retweets: [...result2] });
      dispatch(removeRetweets(tweetObj.id));
      dispatch(removeMyTweets(tweetObj.id));
      setRetweet(false);
    }
  };

  const onLikeClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (user.likes.findIndex((id) => id === tweetObj.id) < 0) {
      // 마음에 들어요
      tweetObj.likes += 1;
      await updateDoc(tweetTextRef, { likes: tweetObj.likes });
      await updateDoc(userRef, { likes: [...user.likes, tweetObj.id] });
      setLike(true);
    } else {
      // 마음에 들어요 취소
      tweetObj.likes -= 1;
      const result = user.likes.filter((id) => id !== tweetObj.id);
      await updateDoc(tweetTextRef, { likes: tweetObj.likes });
      await updateDoc(userRef, { likes: [...result] });
      dispatch(removeLikes(tweetObj.id));
      setLike(false);
    }
  };

  const dt = new Date(tweetObj.createdAt);
  const year = dt.getFullYear();
  const month = dt.getMonth() + 1;
  const date = dt.getDate();
  const hours = dt.getHours() - 12;
  const ampm = dt.getHours() > 12 ? "오후" : "오전";
  const minutes = ("0" + dt.getMinutes()).slice(-2);

  return (
    <>
      {more && <div className="more-modal-wrapper" onClick={() => setMore(false)}></div>}
      <div className={` ${detail === true ? styles.detail : ""}`}>
        <div className={styles.tweet} onClick={ontweetClick}>
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
          {!detail && (
            <div className={styles["user-img"]} onClick={onUserClick}>
              <img referrerPolicy="no-referrer" src={userImg ? userImg : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userImg"></img>
            </div>
          )}
          <div className={styles.content}>
            <div className={`flex mb-2 ${styles.mb}`}>
              {detail && (
                <div className={styles["user-img"]} onClick={onUserClick}>
                  <img referrerPolicy="no-referrer" src={userImg ? userImg : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userImg"></img>
                </div>
              )}
              <div className={`${styles.info} ${!detail ? "flex" : "flex-col"}`}>
                <div className={`underline ${styles["user-name"]}`} onClick={onUserClick}>
                  <h4>{name}</h4>
                </div>
                <div className={styles["user-id"]} onClick={onUserClick}>
                  <p>@{tweetObj.creatorId}</p>
                </div>
                {!detail && (
                  <>
                    <div className="p-4">
                      <p>·</p>
                    </div>
                    <div>
                      <p>
                        {month}월 {date}일
                      </p>
                    </div>
                  </>
                )}
              </div>
              {tweetObj.creatorUid === uid && (
                <button title="더 보기" className="twticon-box more blue" onClick={onMoreClick}>
                  <RiMoreFill className="icon" />
                </button>
              )}
            </div>
            {tweetObj.mention !== "" && (
              <div className={styles.mention}>
                <p>
                  <span>@{tweetObj.mentionTo}</span> 님에게 보내는 답글
                </p>
              </div>
            )}
            {tweetObj.text !== "" && (
              <div className={styles.text}>
                <span>{tweetObj.text}</span>
              </div>
            )}
            {tweetObj.attachmentUrl !== "" && (
              <div className={styles.twtimg}>
                <img src={tweetObj.attachmentUrl} alt={tweetObj.attachmentUrl} onClick={onImgClick} />
              </div>
            )}
            {detail && (
              <div className={styles.date}>
                <p>
                  {ampm} {hours}:{minutes} · {year}년 {month}월 {date}일
                </p>
              </div>
            )}
            <div className={styles.border}>
              <div className={styles.icons}>
                <div className={`flex ${styles["icon-area"]}`}>
                  <div title="답글" className={`twticon-box blue ${styles.twt}`}>
                    <TbMessageCircle2 className="icon" />
                  </div>
                  {<p>{tweetObj.replies.length > 0 && tweetObj.replies.length}</p>}
                </div>
                <div className={`flex green ${styles["icon-area"]}`} onClick={onRetweetClick}>
                  <div title="리트윗" className={`twticon-box ${styles.twt}}`}>
                    <AiOutlineRetweet className={`icon ${retweet && "fill"}`} />
                  </div>
                  {<p className={`${retweet && "fill"}`}>{tweetObj.retweets > 0 && tweetObj.retweets}</p>}
                </div>
                <div className={`flex pink ${styles["icon-area"]}`} onClick={onLikeClick}>
                  <div title="마음에 들어요" className={`twticon-box ${styles.twt} `}>
                    {like ? <RiHeart3Fill className="icon fill" /> : <RiHeart3Line className="icon" />}
                  </div>
                  {tweetObj.likes > 0 && <p className={`${like && "fill"}`}>{tweetObj.likes}</p>}
                </div>
                <div className={`flex ${styles["icon-area"]}`} onClick={onBookmarkClick}>
                  <div title="북마크" className={`twticon-box blue ${styles.twt} ${styles["l-4"]}`}>
                    {bookmark ? <FaBookmark className="icon bm fill" /> : <FiBookmark className="icon" />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tweet;
