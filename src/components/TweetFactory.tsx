import { v4 as uuidv4 } from "uuid";
import { dbAddDoc, dbCollection, dbService, storageService } from "fBase";
import React, { useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { IoImageOutline } from "react-icons/io5";
import { VscSmiley, VscChromeClose } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import useImageCompress from "hooks/imageCompress";

interface FactoryProps {
  uid: string;
  setTweetModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

/* Create Tweet Component*/
const TweetFactory = ({ uid, setTweetModal }: FactoryProps) => {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const user = useSelector((state: RootState) => state.user);
  const { isLoading: isCompressLoading, compressImage } = useImageCompress();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [tweet]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (setTweetModal)
      setTweetModal(false);

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
      attachmentUrl,
      likes: 0,
      retweets: 0,
      replies: [],
    };

    try {
      const docRef = await dbAddDoc(dbCollection(dbService, "tweets"), tweetObj);
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

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.currentTarget.value);
    console.log(textareaRef.current);
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
    if (files instanceof FileList) {
      const theFile = files[0];
      const compressedImage = await compressImage(theFile);
      if (!compressedImage) return;
      // const imageUrl = URL.createObjectURL(compressedImage);
      // setAttachment(imageUrl);
      const reader = new FileReader();
      reader.readAsDataURL(compressedImage); //data_url
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
      {/* <Loading loading={true } /> */}
      <div className="factoryInput__container">
        <div className="user-img">
          <img referrerPolicy="no-referrer" src={user.profileImg !== "" ? user.profileImg : "img/default_profile.png"} alt="userimg"></img>
        </div>
        <div className="factory__content">
          <div className="input-box">
            <textarea className="factoryInput__input" ref={textareaRef} value={tweet} onChange={onChange} placeholder="무슨 일이 일어나고 있나요?" maxLength={150} />
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
                <VscChromeClose className="clear-icon" />
              </div>
            </div>
          )}
          <div className="input-box2">
            <input type="submit" value="트윗하기" disabled={tweet === "" && attachment === ""} className="btn small tweet-btn" />
            <div title="미디어" className="icon-box">
              <label htmlFor="attach-file">
                <IoImageOutline className="tweet-form-icon" />
              </label>
              <input id="attach-file" type="file" accept="image/*" ref={fileInput} onChange={onFileChange} className="img-input" />
              <VscSmiley className="tweet-form-icon" />
            </div>
          </div>
        </div>
      </div>
      {/* {isCompressLoading && "이미지 압축 중.."} */}
    </form>
  );
};

export default TweetFactory;
