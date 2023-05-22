import TopBar from "components/TopBar";
import { useState, useEffect } from "react";
import { getUsers } from "hooks/getUsers";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import People, { PeopleType } from "components/People";

const ConnectPeople = () => {
  const user = useSelector((state: RootState) => state.user);
  const [users, setUsers] = useState<PeopleType[]>([]);

  useEffect(() => {
    getUsers(setUsers, user.id, 20);
  }, []);

  return (
    <div className="wrapper">
      <TopBar title="연결하기" uid="jlk" />
      <div className="container">
        <h3 className="title p1 flex">나를 위한 추천</h3>

        {users.map((user) => {
          return <People key={user.id} id={user.id} name={user.name} profileImg={user.profileImg} bio={user.bio} />;
        })}
      </div>
    </div>
  );
};

export default ConnectPeople;
