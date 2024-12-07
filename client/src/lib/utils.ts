import axiosInstance from "@/lib/axiosInstance";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { isDate } from "util/types";

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
export function formatTimeWithAmPm(timestamp: number) {
  // Parse the timestamp into a Date object
  const date = new Date(Number(timestamp));

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
