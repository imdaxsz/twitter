import { PeopleType } from "components/People";
import { dbService } from "fBase";
import { doc, updateDoc } from "firebase/firestore";

export const follow = async (uid: string, user: PeopleType, followingList: PeopleType[]) => {
  const userRef = doc(dbService, "users", uid);
  await updateDoc(userRef, { following: [user, ...followingList] });
};

export const unFollow = async (uid: string, userId: string, followingList: PeopleType[]) => {
  const userRef = doc(dbService, "users", uid);
  await updateDoc(userRef, { following: [...followingList.filter((follow) => follow.id !== userId)] });
};
