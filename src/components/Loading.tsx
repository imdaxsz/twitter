
import { CSSProperties } from "react";
import { MoonLoader } from "react-spinners";

const override: CSSProperties = {
  position: "absolute",
  top: "50vh",
  left: "46vw",
  zIndex: 9000,
};

const Loading = ({ loading }:{loading:boolean}) => {
  return (
    <div>
      <MoonLoader loading={loading} color={"rgb(29, 155, 240)"} cssOverride={override} />
    </div>
  );
}

export default Loading;