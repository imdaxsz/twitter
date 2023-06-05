import SearchBar from "components/SearchBar";
import ConnectPeople from "./ConnectPeople";
import tb from "styles/topbar.module.css"

function Explore({uid}:{uid:string}) {
  return (
    <div className="wrapper">
      <div className={tb.container}>
        <SearchBar />
      </div>
      <ConnectPeople uid={uid} explore={true} />
    </div>
  );
}

export default Explore;
