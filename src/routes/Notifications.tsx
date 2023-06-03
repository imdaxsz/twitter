import Noti from "components/Noti";
import TopBar from "components/TopBar";
import { Link, useLocation } from "react-router-dom";
import { MentionNoti, TweetNoti } from "types/types";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { dbService } from "fBase";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

function Notifications({ uid }: { uid: string }) {
  const { id } = useSelector((state: RootState) => state.user);
  const { pathname } = useLocation();
  const [follow, setFollow] = useState<string[]>([]);
  const [tweetNoti, setTweetNoti] = useState<TweetNoti[]>([]);
  const [mentions, setMentions] = useState<MentionNoti[]>([]);

  useEffect(() => {
    onSnapshot(doc(dbService, "notifications", id), (doc) => {
      if (doc.exists()) {
        setFollow(doc.data().follow);
        setTweetNoti(doc.data().tweetNoti);
        setMentions(doc.data().mentions);
      }
    });
  }, [follow.length, tweetNoti.length, mentions.length]);

  return (
    <div className="wrapper">
      <TopBar title={"알림"} />
      <div className="container">
        <nav className="nav nav-fix">
          <ul>
            <li className="w-3">
              <Link to={`/notifications`}>
                <div className={`tab ${pathname.split("/").slice(-1)[0] === "notifications" && "active"}`}>
                  <div className="tab-box">
                    <p>전체</p>
                    {pathname.split("/").slice(-1)[0] === "notifications" && <div className="active-bar" />}
                  </div>
                </div>
              </Link>
            </li>
            <li className="w-3">
              <Link to={`/notifications/mentions`}>
                <div className={`tab ${pathname.split("/").slice(-1)[0] === "mentions" && "active"}`}>
                  <div className="tab-box">
                    <p>멘션</p>
                    {pathname.split("/").slice(-1)[0] === "mentions" && <div className="active-bar" />}
                  </div>
                </div>
              </Link>
            </li>
            <li className="w-3">
              <Link to={`/notifications/follow`}>
                <div className={`tab ${pathname.split("/").slice(-1)[0] === "follow" && "active"}`}>
                  <div className="tab-box">
                    <p>팔로우</p>
                    {pathname.split("/").slice(-1)[0] === "follow" && <div className="active-bar" />}
                  </div>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="list-container">
          {pathname.split("/").slice(-1)[0] === "follow" && (
            <>
              {follow.map((a, i) => {
                return <Noti key={i} opt="follow" uid={a} />;
              })}
            </>
          )}
          {pathname.split("/").slice(-1)[0] === "mentions" && (
            <>
              {mentions.map((noti, i) => {
                return <Noti key={i} opt="mention" uid={noti.uid} mention={noti.mention}/>;
              })}
            </>
          )}
          {pathname.split("/").slice(-1)[0] === "notifications" && (
            <>
              {tweetNoti.map((noti, i) => {
                return <Noti key={i} opt={noti.type} uid={noti.uid} tweetObj={noti.tweet} />;
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
