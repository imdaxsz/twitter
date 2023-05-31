import SearchBar from "components/SearchBar";
import tb from "styles/topbar.module.css"
import ConnectPeople from "./ConnectPeople";

function Explore({uid}:{uid:string}) {
  return (
    <div className="wrapper">
      <div className={tb.container}>
        <SearchBar />
      </div>
      <ConnectPeople uid={uid} explore={true} />
      {/* <div className="container">
      </div> */}
    </div>
  );
}

export default Explore;
