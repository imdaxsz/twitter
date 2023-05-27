import { PersonType } from "components/Person";
import { dbService } from "fBase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

type getUserType = (setUser: React.Dispatch<React.SetStateAction<PersonType[]>>, id: string, num: number, filter?: string) => void;

type getUserFollowListType = (setList: React.Dispatch<React.SetStateAction<PersonType[]>>, id: string, filter?: string) => void;

export const getUsers: getUserType = async (setUsers, id, num, filter) => {
  setUsers([]);
  let q;
  if (typeof filter === "string") {
    q = query(collection(dbService, "users"), where("name", "==", filter));
  } else q = query(collection(dbService, "users"), where("id", "!=", id), limit(num));
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

export const getUserFollowList: getUserFollowListType = async (setList, id, filter) => {
  const q = query(collection(dbService, "users"), where("id", "==", id));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    if (filter === "following")
      setList(doc.data().following);
    else
      setList(doc.data().followers);
  });
};
