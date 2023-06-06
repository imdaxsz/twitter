import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "components/SearchBar";
import Person from "components/Person";
import Tweet from "components/Tweet";
import { getUsers } from "utils/getUsers";
import { getTweets } from "utils/getTweet";
import { PersonType, TweetType } from "types/types";
import tb from "styles/topbar.module.css";
import { MdKeyboardBackspace } from "react-icons/md";

const SearchResult = ({ uid }: { uid: string }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("q");
  const filter = searchParams.get("f");

  const [users, setUsers] = useState<PersonType[]>([]);
  const [tweets, setTweets] = useState<TweetType[]>([]);

  const onClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (keyword && filter) {
      getUsers(setUsers, uid, 99, keyword);
    }
    if (keyword && !filter) {
      getTweets(setTweets, uid, keyword);
    }
  }, [keyword, filter, uid]);

  return (
    <div className="wrapper">
      <div className="container">
        <div className={tb.container}>
          <div className={tb["icon-box"]}>
            <div className={tb.hover} onClick={onClick}>
              <MdKeyboardBackspace className={tb.icon} />
            </div>
          </div>
          <SearchBar keyword={keyword ? keyword : ""} />
        </div>
        <nav className="nav">
          <ul>
            <li className="w-50">
              <Link to={`/search?q=${keyword}`}>
                <div className={`tab ${!filter && "active"}`}>
                  <div className="tab-box">
                    <p>트윗</p>
                    {!filter && <div className="active-bar" />}
                  </div>
                </div>
              </Link>
            </li>
            <li className="w-50">
              <Link to={`/search?q=${keyword}&f=user`}>
                <div className={`tab ${filter && "active"}`}>
                  <div className="tab-box">
                    <p>사용자</p>
                    {filter && <div className="active-bar" />}
                  </div>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          {!filter ? (
            <div>
              {tweets.map((tweet) => (
                <Tweet key={tweet.id} tweetObj={tweet} uid={uid} />
              ))}
            </div>
          ) : (
            <div>
              {users.map((u) => {
                return <Person key={u.id} user={u} uid={uid} />;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
