import { PersonType } from "components/Person";
import { dbService } from "fBase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

type getUserType = (setUser: React.Dispatch<React.SetStateAction<PersonType[]>>, id: string, num: number) => void;

export const getUsers: getUserType = async (setUsers, id, num) => {
  setUsers([]);
  const q = query(collection(dbService, "users"), where("id", "!=", id), limit(num));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    const userObj: PersonType = {
      id: doc.data().id,
      name: doc.data().name,
      profileImg: doc.data().profileImg,
      bio: doc.data().bio,
    };
    setUsers((prev) => [...prev, userObj]);
  });
};
