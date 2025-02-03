import prisma from "../services/prisma";

export const getUserDetails = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};
