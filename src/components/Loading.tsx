import { ClipLoader } from "react-spinners";

const Loading = ({ loading }: { loading: boolean }) => {

  return (
    <div className={`loading-container ${!loading && "none"}`} >
      <ClipLoader loading={loading} color={"rgb(29, 155, 240)"} />
    </div>
  );
}

export default Loading;