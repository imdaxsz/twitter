import { dbCollection, dbService } from "fBase";
import { collection, doc, getDocs, limit, onSnapshot, query, where } from "firebase/firestore";
import { PersonType, UserInfo } from "./../types/types";

type getUserType = (setUser: React.Dispatch<React.SetStateAction<PersonType[]>>, id: string, num: number, filter?: string) => void;

type getUserFollowListType = (setList: React.Dispatch<React.SetStateAction<PersonType[]>>, id: string, filter?: string) => void;

type getUserInfoType = (setName: React.Dispatch<React.SetStateAction<string>>, setUserImg: React.Dispatch<React.SetStateAction<string | null>>, uid: string, setUserId?: React.Dispatch<React.SetStateAction<string>>) => void;

type getUserDataType = (paramId: string, setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>, setUserBtnProps: React.Dispatch<React.SetStateAction<PersonType | null>>) => void;


// 팔로우 추천에 사용됨
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

// 팔로우 리스트
export const getUserFollowList: getUserFollowListType = async (setList, id, filter) => {
  const q = query(collection(dbService, "users"), where("id", "==", id));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    if (filter === "following") setList(doc.data().following);
    else setList(doc.data().followers);
  });
};

// 트윗에서 사용자 이름 및 프로필 이미지 가져오기
export const getUserInfo: getUserInfoType = (setName, setUserImg, uid, setUserId) => {
  onSnapshot(doc(dbService, "users", uid), (doc) => {
    if (doc.exists()) {
      setUserImg(doc.data().profileImg);
      setName(doc.data().name);
      if (setUserId)
        setUserId(doc.data().id);
    }
  });
};

// 프로필 페이지 사용자 정보 조회
export const getUserData: getUserDataType = async (paramId, setUserInfo, setUserBtnProps) => {
  const q = query(dbCollection(dbService, "users"), where("id", "==", paramId));

  onSnapshot(q, (snapshot) => {
    const userObj: UserInfo = {
      id: snapshot.docs[0].data().id,
      name: snapshot.docs[0].data().name,
      bio: snapshot.docs[0].data().bio,
      profileImg: snapshot.docs[0].data().profileImg,
      headerImg: snapshot.docs[0].data().headerImg,
      followers: snapshot.docs[0].data().followers.length,
      following: snapshot.docs[0].data().following.length,
      joinDate: snapshot.docs[0].data().joinDate,
    };
    const userProfile: PersonType = {
      id: snapshot.docs[0].data().id,
      name: snapshot.docs[0].data().name,
      bio: snapshot.docs[0].data().bio,
      profileImg: snapshot.docs[0].data().profileImg,
    };
    setUserInfo(userObj);
    setUserBtnProps(userProfile);
  });
};
