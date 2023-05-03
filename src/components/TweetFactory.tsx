import { v4 as uuidv4 } from "uuid";
import { dbAddDoc, dbCollection, dbService, storageService } from "fBase";
import React, { useRef, useState } from "react";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { User } from "firebase/auth";


/* Create Tweet Component*/
const TweetFactory = ({ userObj }: { userObj: User | null }) => {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (tweet === "") return;
    e.preventDefault();
    let attachmentUrl = "";

    if (attachment !== "") {
      // 파일 경로 참조 만들기
      const attachmentRef = ref(storageService, `${userObj?.uid}/${uuidv4()}`);
      // storage 참조 경로로 파일 업로드 하기
      const response = await uploadString(attachmentRef, attachment, "data_url");
      // storage 참조 경로에 있는 파일의 URL을 다운로드해서 attchmentUrl에 넣어서 업데이트
      attachmentUrl = await getDownloadURL(response.ref);
      // reponse.ref == attachmentref
    }

    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj?.uid,
      attachmentUrl,
    };

    try {
      const docRef = await dbAddDoc(dbCollection(dbService, "tweets"), tweetObj);
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
        setAttachment(finishedEvent.target?.result as string);
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
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input className="factoryInput__input" value={tweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        ref={fileInput}
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
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
