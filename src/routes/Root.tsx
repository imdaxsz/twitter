import LeftBar from "components/LeftBar";
import RightBar from "components/RightBar";
import { Outlet, useLocation } from "react-router-dom";
import Home from "./Home";
import Bottombar from "components/Bottombar";

const Root = ({ uid, isMobile }: { uid: string; isMobile:boolean }) => {
  const location = useLocation();
  return (
    <div className="app-container">
      {!isMobile && <LeftBar uid={uid} />}
      {location.pathname === "/" && <Home uid={uid} isMobile={isMobile} />}
      <Outlet />
      {isMobile && <Bottombar />}
      <RightBar uid={uid} />
    </div>
  );
};

export default Root;
