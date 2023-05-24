import { PersonType } from "components/Person";
import { dbService } from "fBase";
import { doc, updateDoc } from "firebase/firestore";

export const follow = async (uid: string, user: PersonType, followingList: PersonType[]) => {
  const userRef = doc(dbService, "users", uid);
  await updateDoc(userRef, { following: [user, ...followingList] });
};

export const unFollow = async (uid: string, userId: string, followingList: PersonType[]) => {
  const userRef = doc(dbService, "users", uid);
  await updateDoc(userRef, { following: [...followingList.filter((follow) => follow.id !== userId)] });
};
