import TweetFactory from "./TweetFactory";
import { VscClose } from "react-icons/vsc";

interface TweetProps {
  uid: string;
  setTweetModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function TweetModal({ uid, setTweetModal }: TweetProps) {
  const onCloseClick = () => {
    setTweetModal(false);
  };

  return (
    <div className="modal-wrapper">
      <div className="modal modal-shadow twt-modal">
        <div className="modal-top flex">
          <div className="modal-icon" onClick={onCloseClick}>
            <VscClose className="modal-svg" />
          </div>
        </div>
        <TweetFactory uid={uid} setTweetModal={setTweetModal}/>
      </div>
    </div>
  );
}

export default TweetModal;
