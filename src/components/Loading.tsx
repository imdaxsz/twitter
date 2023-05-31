
import { CSSProperties } from "react";
import { ClipLoader } from "react-spinners";

const override: CSSProperties = {
  position: "absolute",
  top: "50vh",
  left: "50%",
  zIndex: 9000,
};

const Loading = ({ loading }:{loading:boolean}) => {
  return (
    <div>
      <ClipLoader loading={loading} color={"rgb(29, 155, 240)"} cssOverride={override} />
    </div>
  );
}

export default Loading;