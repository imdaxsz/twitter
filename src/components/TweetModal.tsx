import { useDispatch } from "react-redux";
import TweetFactory from "./TweetFactory";
import { VscClose } from "react-icons/vsc";
import { resetEdit } from "store/EditSlice";
import { useEffect } from "react";

interface TweetProps {
  uid: string;
}

function TweetModal({ uid }: TweetProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    }
  }, [])

  const onCloseClick = () => {
    dispatch(resetEdit());
  };

  return (
    <div className="modal-wrapper" onClick={onCloseClick}>
      <div className="modal modal-shadow twt-modal" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-top flex">
          <div className="modal-icon" onClick={onCloseClick}>
            <VscClose className="modal-svg" />
          </div>
        </div>
        <TweetFactory uid={uid}/>
      </div>
    </div>
  );
}

export default TweetModal;
