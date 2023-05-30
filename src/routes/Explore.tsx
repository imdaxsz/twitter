import SearchBar from "components/SearchBar";
import tb from "styles/topbar.module.css"

function Explore() {
  return (
    <div className="wrapper">
      <div className={tb.container}>
        <SearchBar />
      </div>
      <div className="container">
        탐색하기
      </div>
    </div>
  );
}

export default Explore;
