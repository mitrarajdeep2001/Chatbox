import axiosInstance from "@/lib/axiosInstance";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const saveUserData = async (user: User, name: string) => {
  try {
    await axiosInstance.post("/auth/register", {
      uid: user.uid,
      email: user.email,
      name: user.displayName || name,
      photoURL: user.photoURL || "",
    });
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("User Info:", {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
    });

    // Optional: Save user data to your database
    await saveUserData(user, "");
  } catch (error) {
    console.error("Error with Google login:", error);
  }
};

export const signUp = async (name: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // Call your function to store user data in the database here
    saveUserData(user, name);
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
     await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

// format time with am/pm
export function formatTimeWithAmPm(timestamp: string) {
  // Parse the timestamp into a Date object
  const date = new Date(timestamp);

  // Extract hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Replace '0' with '12'

  // Format minutes to always be two digits
  const formattedMinutes = minutes.toString().padStart(2, "0");

  // Return the formatted time
  return `${hours}:${formattedMinutes} ${ampm}`;
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>): void {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function getMediaFileDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (
      !file.type.startsWith("video/") &&
      !file.type.startsWith("audio/") &&
      !file.type.startsWith("image/")
    ) {
      reject(new Error("The provided file is not a video."));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error("Failed to convert the file to a data URI."));
      }
    };

    reader.onerror = () => {
      reject(new Error("An error occurred while reading the file."));
    };

    reader.readAsDataURL(file);
  });
}

export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};