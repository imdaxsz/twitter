import SearchBar from "./SearchBar";

function RightBar() {
  return (
    <div className="rightbar-container">
      <SearchBar/>
      <div style={{marginTop: 15}}>
        <h3>팔로우 추천</h3>
      </div>
    </div>
  )
}

export default RightBar;