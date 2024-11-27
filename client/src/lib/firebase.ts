// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9ppVuxCFWO3bM9kK-ot7g2aEGu-owr8Y",
  authDomain: "chatbox-7e6ad.firebaseapp.com",
  projectId: "chatbox-7e6ad",
  storageBucket: "chatbox-7e6ad.firebasestorage.app",
  messagingSenderId: "413794787619",
  appId: "1:413794787619:web:d7cad28c84a2ec2c0c6c96",
  measurementId: "G-0LBGME5M8W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const user = auth.currentUser;
