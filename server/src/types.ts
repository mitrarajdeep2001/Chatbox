export interface Message {
  chatId: string;
  createdBy: string;
  text: string;
  emojie?: string;
  image?: string;
  audio?: string;
  video?: string;
  gif?: string;
}
