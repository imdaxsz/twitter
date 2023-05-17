import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "styles/searchbar.module.css";

function SearchBar() {
  const [word, setWord] = useState("");
  const focusRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.currentTarget.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(word);
  };

  const focusSearchBar = () => {
    if (focusRef.current instanceof HTMLInputElement) focusRef.current.focus();
  };

  const clearWord = (e: React.MouseEvent<HTMLSpanElement>) => {
    focusSearchBar();
    setWord("");
  };

  return (
    <form onSubmit={onSubmit} aria-label="트위터 검색" role="search">
      <div className={styles.container} onClick={focusSearchBar}>
        <div className={styles.icon}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
        <input onChange={onChange} type="text" value={word} placeholder="트위터 검색" className={styles.input} ref={focusRef}></input>

        {word !== "" && (
          <span tabIndex={0} className={styles.clear} onClick={clearWord}>
            <FontAwesomeIcon icon={faCircleXmark} size="lg" />
          </span>
        )}
      </div>
    </form>
  );
}

export default SearchBar;
