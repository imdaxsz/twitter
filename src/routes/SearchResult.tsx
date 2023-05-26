import SearchBar from "components/SearchBar";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import tb from "styles/topbar.module.css";
import styles from "styles/profile.module.css";
import { useState, useEffect } from "react";
import Person, { PersonType } from "components/Person";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import Tweet, { TweetType } from "components/Tweet";
import { getUsers } from "hooks/getUsers";
import getTweets from "hooks/getTweet";

const SearchResult = ({uid}:{uid:string}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("q");
  const filter = searchParams.get("f");

  const user = useSelector((state: RootState) => state.user);
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
  }, [keyword, filter]);

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
        <nav className={`${styles.nav} `}>
          <ul>
            <li className={styles["w-0"]}>
              <Link to={`/search?q=${keyword}`}>
                <div className={`${styles.tab} ${!filter && "active"}`}>
                  <div className={styles.box}>
                    <p>트윗</p>
                    {!filter && <div className="active-bar" />}
                  </div>
                </div>
              </Link>
            </li>
            <li className={styles["w-0"]}>
              <Link to={`/search?q=${keyword}&f=user`}>
                <div className={`${styles.tab} ${filter && "active"}`}>
                  <div className={styles.box}>
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
                return <Person key={u.id} user={u} uid={uid} followList={user.following} />;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
