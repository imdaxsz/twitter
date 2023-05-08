import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

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

  const clearWord = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (focusRef.current instanceof HTMLInputElement)
      focusRef.current.focus();
    setWord("");
  };

  return (
    <form onSubmit={onSubmit} aria-label="트위터 검색" role="search">
      <div className="search__container">
        <div className="searchbar__icon">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
        {/* <div className="searchbar__input">
          <input onChange={onChange} type="text" value={word} placeholder="트위터 검색"></input>
        </div> */}
        <input onChange={onChange} type="text" value={word} placeholder="트위터 검색" className="searchbar__input" ref={focusRef}></input>

        {word !== "" && (
          <span className="clear" onClick={clearWord}>
            <FontAwesomeIcon icon={faCircleXmark} size="lg" />
          </span>
        )}
      </div>
    </form>
  );
}

export default SearchBar;
