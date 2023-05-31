import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetEdit } from "store/EditSlice";
import TweetFactory from "./TweetFactory";
import { VscClose } from "react-icons/vsc";

interface TweetProps {
  uid: string;
  isMobile?: boolean;
}

function TweetModal({ uid, isMobile }: TweetProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const onCloseClick = () => {
    dispatch(resetEdit());
  };

  return (
    <div className="modal-wrapper" onClick={onCloseClick}>
      <div className="modal modal-shadow twt-modal" onClick={(e) => e.stopPropagation()}>
        {!isMobile && (
          <div className="modal-top flex">
            <div className="modal-icon" onClick={onCloseClick}>
              <VscClose className="modal-svg" />
            </div>
          </div>
        )}
        <TweetFactory uid={uid} isMobile={isMobile} />
      </div>
    </div>
  );
}

export default TweetModal;
