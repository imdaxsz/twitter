import TopBar from "components/TopBar";
import { useState, useEffect } from "react";
import { getUsers } from "hooks/getUsers";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import Person, { PersonType } from "components/Person";

const ConnectPeople = ({ uid, explore }: { uid: string; explore?: boolean }) => {
  const user = useSelector((state: RootState) => state.user);
  const [users, setUsers] = useState<PersonType[]>([]);

  useEffect(() => {
    getUsers(setUsers, user.id, 20);
  }, []);

  return (
    <div className="wrapper">
      {!explore && <TopBar title="연결하기" uid="jlk" />}
      <div className="container">
        <h3 className="title p1 flex">나를 위한 추천</h3>
        {users.map((u) => {
          return <Person key={u.id} user={u} uid={uid} />;
        })}
      </div>
    </div>
  );
};

export default ConnectPeople;
