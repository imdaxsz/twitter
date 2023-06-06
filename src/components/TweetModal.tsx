import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetEdit } from "store/EditSlice";
import TweetFactory from "./TweetFactory";
import { VscClose } from "react-icons/vsc";
import md from "styles/modal.module.css";

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
    <div className={md.wrapper} onClick={onCloseClick}>
      <div className={`${md.modal} ${md.shadow} ${md.twt}`} onClick={(e) => e.stopPropagation()}>
        {!isMobile && (
          <div className={`${md.top} flex`}>
            <div className={md.icon} onClick={onCloseClick}>
              <VscClose className={md.svg} />
            </div>
          </div>
        )}
        <TweetFactory uid={uid} isMobile={isMobile} />
      </div>
    </div>
  );
}

export default TweetModal;
