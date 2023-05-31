export interface PersonType {
  id: string;
  name: string;
  profileImg: string | null;
  bio?: string;
}

export interface TweetType {
  id: string;
  text: string;
  createdAt: number;
  creatorId: string | undefined;
  creatorUid: string;
  attachmentUrl: string;
  likes: string[];
  retweets: number;
  replies: string[];
  mention: string;
  mentionTo: string;
}

export interface UserInfo {
  id: string;
  name: string;
  bio: string;
  profileImg: string | null;
  headerImg: string | null;
  following: number;
  followers: number;
  joinDate: string;
}