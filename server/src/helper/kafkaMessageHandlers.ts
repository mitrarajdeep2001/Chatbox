import prisma from "../services/prisma";
import { Message } from "../types";

const createMessage = async (message: string) => {
  try {
    const { chatId, createdBy, text, emojie, image, audio, video, gif } =
      JSON.parse(message) as Message;
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

    // const isChatExists = await prisma.chat.findUnique({
    //   where: { id: chatId },
    // });
    // const isUserExists = await prisma.user.findUnique({
    //   where: { id: createdBy },
    // });
    // if (!isChatExists || !isUserExists) {
    //   return;
    // }

    // await prisma.message.create({
    //   data: {
    //     chatId,
    //     createdBy: isUserExists.id,
    //     text,
    //     image,
    //     emojie,
    //     audio,
    //     video,
    //     gif,
    //   },
    // });
    // await prisma.chat.update({
    //   where: { id: chatId },
    //   data: {
    //     unseenMsgCount: { increment: 1 },
    //   },
    // });
  } catch (error) {
    console.log(error);
  }
};

export default createMessage;
