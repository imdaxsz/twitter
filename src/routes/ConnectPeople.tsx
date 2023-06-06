import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import TopBar from "components/TopBar";
import Person from "components/Person";
import { getUsers } from "utils/getUsers";
import { PersonType } from "types/types";

const ConnectPeople = ({ uid, explore }: { uid: string; explore?: boolean }) => {
  const user = useSelector((state: RootState) => state.user);
  const [users, setUsers] = useState<PersonType[]>([]);

  useEffect(() => {
    getUsers(setUsers, user.id, 20);
  }, []);

  return (
    <div className="wrapper">
      {!explore && <TopBar title="연결하기" />}
      <div className="container">
        <h3 className="connect-title p1 flex">나를 위한 추천</h3>
        {users.map((u) => {
          return <Person key={u.id} user={u} uid={uid} />;
        })}
      </div>
    </div>
  );
};

export default ConnectPeople;
