export type Member = {
  id: string;
  name: string;
  email: string;
  profilePic?: string | null;
};

export type Message = {
  id: string;
  chatId: string;
  creator: Member;
  updatedAt: string;
  createdAt: string;
  text?: string | null;
  image?: string | null;
  audio?: string | null;
  video?: string | null;
  gif?: string | null;
  status?: "sent" | "delivered" | "read";
  repliedToId?: string | null;
  repliedTo?: Message | null;
};

export type Chat = {
  id: string;
  isGroup: boolean;
  groupName?: string | null;
  groupProfilePic?: string | null;
  member?: Member;
  lastMessage?: Message | null;
  unseenCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};
