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

export const handleUserOnlineStatus = async (userId: string, isOnline: boolean) => {
  try {
    console.log(`Updating user ${userId} online status to ${isOnline}`);
    
    const isUserExists = await getUserDetails(userId);

    if (!isUserExists) {
      console.log("User not found");
      return;
    }
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isOnline,
        lastSeenAt: new Date().toISOString(),
      },
    });
    console.log(`User ${userId} online status updated to ${isOnline}`);
  } catch (error) {
    console.error("Error updating user online status:", error);
  }
}