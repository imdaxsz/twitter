import TopBar from "components/TopBar";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

function BookMarks({ uid }: { uid: string }) {
  const user = useSelector((state: RootState) => state.user);
  return (
    <div className="wrapper">
      <TopBar title={"북마크"} uid={uid} />
      <div className="container"></div>
    </div>
  );
}

export default BookMarks;
