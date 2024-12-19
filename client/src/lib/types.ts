export type Member = {
  id: string;
  name: string;
  email: string;
  profilePic?: string | null;
};

export type Message = {
  chatId: string;
  createdBy: string;
  createdAt: number;
  text?: string | null;
  image?: string | null;
  audio?: string | null;
  video?: string | null;
  gif?: string | null;
};

export type Chat = {
  id: string;
  isGroup: boolean;
  groupName?: string | null;
  groupProfilePic?: string | null;
  member?: Member;
  lastMessage?: Message | null;
  unseenMsgCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};
