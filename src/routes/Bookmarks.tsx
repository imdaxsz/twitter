import TopBar from "components/TopBar";
import { User } from "firebase/auth";

function BookMarks({ userObj }: { userObj: User | null }) {
  return (
    <div className="container">
      <TopBar title={"북마크"} userId={'@pwfases'} />
    </div>
  );
}

export default BookMarks;