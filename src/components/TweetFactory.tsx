import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { resetEdit } from "store/EditSlice";
import { useNavigate } from "react-router-dom";
import { dbAddDoc, dbCollection, dbService, storageService } from "fBase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ProgressBar from "@ramonak/react-progress-bar";
import { v4 as uuidv4 } from "uuid";
import useImageCompress from "hooks/imageCompress";
import styles from "styles/factory.module.css";
import { IoImageOutline } from "react-icons/io5";
import { VscChromeClose } from "react-icons/vsc";
import { MdKeyboardBackspace } from "react-icons/md";

interface FactoryProps {
  uid: string;
  mention?: string;
  mentionTo?: string;
  isMobile?: boolean;
}

/* Create Tweet Component*/
const TweetFactory = ({ uid, mention, mentionTo, isMobile }: FactoryProps) => {
  const [tweet, setTweet] = useState("");

  const [attachment, setAttachment] = useState("");
  const user = useSelector((state: RootState) => state.user);
  const edit = useSelector((state: RootState) => state.edit);
  const dispatch = useDispatch();

  const compressImage = useImageCompress().compressImage;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    // textarea 높이 조정
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [tweet]);

  useEffect(() => {
    if (edit.editObj.id !== "") {
      console.log(edit.editObj);
      setTweet(edit.editObj.text);
      setAttachment(edit.editObj.attachmentUrl);
    } else {
      setTweet("");
      setAttachment("");
    }
  }, []);

  useEffect(() => {
    // progressbar 조절
    if (loading) {
      let interval = setInterval(() => {
        setPercentage((prev) => {
          if (percentage < 90) {
            return prev + Math.floor(Math.random() * 20);
          } else if (percentage >= 90 && percentage < 100) {
            return prev + 1;
          } else return 100;
        });
      }, 10);
      if (percentage >= 100) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }
  }, [percentage, loading]);

  // 트윗 추가하기
  const addTweet = async (tweetObj: any) => {
    const docRef = await dbAddDoc(dbCollection(dbService, "tweets"), tweetObj);
    if (typeof mention === "string") {
      const twtRef = doc(dbService, "tweets", mention);
      const twtSnap = await getDoc(twtRef);
      if (twtSnap.exists()) {
        await updateDoc(twtRef, { replies: [...twtSnap.data().replies, docRef.id] });
      }
    } else {
      const userRef = doc(dbService, "users", uid);
      await updateDoc(userRef, { myTweets: [docRef.id, ...user.myTweets] });
    }
    console.log("Document wirtten with ID: ", docRef.id);
    setLoading(false);
    setPercentage(15);
    setTweet("");
    setAttachment("");
    if (fileInput.current) {
      fileInput.current.value = "";
    }
    dispatch(resetEdit());
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    let start = Date.now();
    setLoading(true);
    e.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "" && edit.editObj.attachmentUrl === "") {
      const attachmentRef = ref(storageService, `${uid}/${uuidv4()}`);
      // storage 참조 경로로 파일 업로드 하기
      const response = await uploadString(attachmentRef, attachment, "data_url");
      // storage 참조 경로에 있는 파일의 URL을 다운로드해서 attchmentUrl에 넣어서 업데이트
      attachmentUrl = await getDownloadURL(response.ref);
    }

    if (edit.editObj.id !== "" && edit.editObj.text !== tweet) {
      const docRef = doc(dbService, "tweets", edit.editObj.id);
      await updateDoc(docRef, { text: tweet });
      dispatch(resetEdit());
    } else {
      let tweetObj = {
        text: tweet,
        createdAt: Date.now(),
        creatorId: user.id,
        creatorUid: uid,
        attachmentUrl,
        likes: [],
        retweets: [],
        replies: [],
        mention: mention ? mention : "",
        mentionTo: mentionTo ? mentionTo : "",
      };

      try {
        let end = Date.now();
        if (end - start < 200) {
          setTimeout(async () => {
            addTweet(tweetObj);
            if (isMobile) navigate("/");
          }, 600);
        } else {
          addTweet(tweetObj);
          if (isMobile) navigate("/");
        }
      } catch (error) {
        console.error("Error adding document:", error);
        if (isMobile) navigate("/");
      }
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.currentTarget.value);
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  };

  const fileInput = useRef<HTMLInputElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { files },
    } = e;
    console.log(files);
    if (files instanceof FileList) {
      const theFile = files[0];
      const compressedImage = await compressImage(theFile);
      if (!compressedImage) return;
      const reader = new FileReader();
      reader.readAsDataURL(compressedImage); //data_url
      reader.onloadend = (finishedEvent) => {
        console.log(finishedEvent);
        if (finishedEvent.target && typeof finishedEvent.target.result == "string") {
          console.log("이미지 저장됨");
          setAttachment(finishedEvent.target.result);
          console.log(attachment);
        } else console.log("저장X");
      };
    }
  };

  const onClearAttachment = () => {
    setAttachment("");
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {loading && <ProgressBar completed={percentage} maxCompleted={100} height="0.2rem" borderRadius="2px" baseBgColor="rgba(0,0,0,0)" bgColor="rgb(29, 155, 240)" isLabelVisible={false} />}
      {isMobile && (
        <div className="modal-top flex">
          <div className="modal-icon" onClick={() => dispatch(resetEdit())}>
            <MdKeyboardBackspace className="modal-svg" />
          </div>
          <input type="submit" value="트윗하기" disabled={tweet === "" && attachment === ""} className={`btn small ${styles["btn-tweet"]}`} />
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.default}>
          <div className={styles.user}>
            <img referrerPolicy="no-referrer" src={user.profileImg ? user.profileImg : `${process.env.PUBLIC_URL}/img/default_profile.png`} alt="userimg"></img>
          </div>
          <div className={styles.content}>
            <div className={styles["textarea-container"]}>
              <textarea className={styles.textarea} autoFocus={isMobile} ref={textareaRef} value={tweet} onChange={onChange} placeholder={!mention ? "무슨 일이 일어나고 있나요?" : "내 답글을 트윗하세요."} maxLength={150} />
            </div>
            {attachment && (
              <div className={styles.attachment}>
                <img src={attachment} alt={attachment} />
                {edit.editObj.attachmentUrl === "" && (
                  <div className={styles.clear} onClick={onClearAttachment}>
                    <VscChromeClose className={styles["clear-icon"]} />
                  </div>
                )}
              </div>
            )}
            {!isMobile && (
              <div className={styles.bottom}>
                <input type="submit" value={!mention ? "트윗하기" : "답글"} disabled={tweet === "" && attachment === ""} className={`btn small ${styles["btn-tweet"]}`} />
                {edit.editObj.id === "" && (
                  <>
                    <div title="미디어" className={styles["icon-box"]}>
                      <label htmlFor="attach-file">
                        <IoImageOutline className={styles.icon} />
                      </label>
                    </div>
                    <input id="attach-file" type="file" accept="image/*" ref={fileInput} onChange={onFileChange} />
                  </>
                )}
              </div>
            )}
          </div>
          {isMobile && (
            <div className={styles.bottom}>
              {edit.editObj.id === "" && (
                <>
                  <div title="미디어" className={styles["icon-box"]}>
                    <label htmlFor="attach-file">
                      <IoImageOutline className={styles.icon} />
                    </label>
                  </div>
                  <input id="attach-file" type="file" accept="image/*" ref={fileInput} onChange={onFileChange} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default TweetFactory;
