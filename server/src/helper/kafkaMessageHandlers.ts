import prisma from "../services/prisma";

interface Message {
  chatId: string;
  createdBy: string;
  text: string;
  emojie?: string;
  image?: string;
  audio?: string;
  video?: string;
  gif?: string;
}

const createMessage = async ({
  chatId,
  createdBy,
  text,
  image,
  emojie,
  audio,
  video,
  gif,
}: Message) => {
  try {
    console.log(
      chatId,
      createdBy,
      text,
      image,
      emojie,
      audio,
      video,
      gif,
      "chatId, createdBy, text, image, emojie, audio, video, gif"
    );

    const isChatExists = await prisma.chat.findUnique({
      where: { id: chatId },
    });
    const isUserExists = await prisma.user.findUnique({
      where: { email: createdBy },
    });
    if (!isChatExists || !isUserExists) {
      return;
    }

    await prisma.message.create({
      data: {
        chatId,
        createdBy: isUserExists.id,
        text,
        image,
        emojie,
        audio,
        video,
        gif,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export default createMessage;
