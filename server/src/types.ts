export interface Message {
  id: string;
  chatId: string;
  createdBy: string;
  updatedAt: string;
  createdAt: string;
  text: string;
  emojie?: string;
  image?: string;
  audio?: string;
  video?: string;
  gif?: string;
  status?: "sent" | "delivered" | "read";
  repliedToId?: string;
}
