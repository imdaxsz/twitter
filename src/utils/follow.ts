import { PersonType } from "types/types";
import { dbCollection, dbService } from "fBase";
import { doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";

type FollowParam = (
  uid: string,
  userId: string, // 팔로우 or 언팔로우 할 대상
  currentUser: PersonType, // 현재 사용자
  followingList: string[] // 현재 사용자의 팔로잉 리스트
) => void;

export const follow: FollowParam = async (uid, userId, currentUser, followingList) => {
  // 현재 사용자의 팔로잉 리스트에 추가
  const userRef = doc(dbService, "users", uid);
  await updateDoc(userRef, { following: [userId, ...followingList] });

  // 팔로잉 대상 사용자의 팔로워 리스트에 현재 사용자 추가
  const q = query(dbCollection(dbService, "users"), where("id", "==", userId));
  let followId = "";
  let followerList: string[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    followId = doc.id;
    followerList = doc.data().followers;
  });
  if (followId !== "") {
    const followRef = doc(dbService, "users", followId);
    await updateDoc(followRef, { followers: [currentUser.id, ...followerList] });
  }

  // 팔로우 알림
  const notiRef = doc(dbService, "notifications", userId);
  const docSnap = await getDoc(notiRef);
  if (docSnap.exists()) {
    await updateDoc(notiRef, { follow: [uid, ...docSnap.data().follow] });
  }
};

export const unFollow: FollowParam = async (uid, userId, currentUser, followingList) => {
  // 현재 사용자의 팔로잉 리스트에서 제거
  const userRef = doc(dbService, "users", uid);
  await updateDoc(userRef, { following: [...followingList.filter((follow) => follow !== userId)] });

  // 팔로잉 대상 사용자의 팔로워 리스트에서 현재 사용자 제거
  const q = query(dbCollection(dbService, "users"), where("id", "==", userId));
  let followId = "";
  let followerList: string[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    followId = doc.id;
    followerList = doc.data().followers;
  });
  if (followId !== "") {
    const followRef = doc(dbService, "users", followId);
    await updateDoc(followRef, { followers: [...followerList.filter((follow) => follow !== currentUser.id)] });
  }
};
