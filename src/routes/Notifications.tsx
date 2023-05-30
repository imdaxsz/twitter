import TopBar from "components/TopBar";

function Notifications({ uid }:{uid:string}) {
  return (
    <div className="wrapper">
      <TopBar title={"알림"} uid={uid} />
      <div className="container"></div>
    </div>
  );
}

export default Notifications;
