import { v4 as uuidv4 } from "uuid";
import { dbAddDoc, dbCollection, dbService, storageService } from "fBase";
import React, { useRef, useState } from "react";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { IoImageOutline } from "react-icons/io5";
import { VscSmiley } from "react-icons/vsc";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from 'store/store';

/* Create Tweet Component*/
const TweetFactory = ({uid}:{uid:string}) => {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");  
  const user = useSelector((state: RootState) => state.user);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (tweet === "") return;
    e.preventDefault();
    let attachmentUrl = "";

    if (attachment !== "") {
      // 파일 경로 참조 만들기
      const attachmentRef = ref(storageService, `${uid}/${uuidv4()}`);
      // storage 참조 경로로 파일 업로드 하기
      const response = await uploadString(attachmentRef, attachment, "data_url");
      // storage 참조 경로에 있는 파일의 URL을 다운로드해서 attchmentUrl에 넣어서 업데이트
      attachmentUrl = await getDownloadURL(response.ref);
      // reponse.ref == attachmentref
    }

    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: user.id,
      creatorUid: uid,
      creatorName: user.name,
      attachmentUrl,
      likes: 0,
      retweets: 0,
      replies:[]
    };

    try {
      const docRef = await dbAddDoc(dbCollection(dbService, "tweets"), tweetObj);
      // const userRef = doc(dbService, "users", uid);
      // const docSnap = await getDoc(userRef);
      // let count = 0;
      // if (docSnap.exists()) {
      //   count = docSnap.data().tweets;
      //   await updateDoc(userRef, { tweets: count + 1 });
      // }
      // key: value 형태로 data 추가. 값이 동일한 경우 하나만 기입
      console.log("Document wirtten with ID: ", docRef);
    } catch (error) {
      console.error("Error adding document:", error);
    }

    setTweet("");
    setAttachment("");
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTweet(e.currentTarget.value);
  };

  const fileInput = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { files },
    } = e;
    if (files instanceof FileList) {
      const theFile = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(theFile); //data_url
      reader.onloadend = (finishedEvent) => {
        console.log(finishedEvent);
        if (finishedEvent.target && typeof finishedEvent.target.result == "string") {
          setAttachment(finishedEvent.target.result);
        }
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
      <div className="factoryInput__container">
        <div className="user-img">
          <img src={user.profileImg !=="" ? user.profileImg : "img/default_profile.png"} alt="userimg"></img>
        </div>
        <div>
          <div className="input-box">
            <input className="factoryInput__input" value={tweet} onChange={onChange} type="text" placeholder="무슨 일이 일어나고 있나요?" maxLength={120} />
          </div>
          <div className="input-box2">
            <input type="submit" value="트윗하기" disabled={tweet===""} className="btn small tweet-btn" />
            <div className="icon-box">
              <label htmlFor="attach-file">
                <IoImageOutline className="tweet-form-icon" />
              </label>
              <input id="attach-file" type="file" accept="image/*" ref={fileInput} onChange={onFileChange} className="img-input" />
              <VscSmiley className="tweet-form-icon" />
            </div>
          </div>
        </div>
      </div>
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
            alt={attachment}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default TweetFactory;
