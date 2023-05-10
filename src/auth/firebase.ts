import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1WwFYyxLDpepyt9fU7ZmBS4bfGbHVfqM",
  authDomain: "taskgenius-1833f.firebaseapp.com",
  projectId: "taskgenius-1833f",
  storageBucket: "taskgenius-1833f.appspot.com",
  messagingSenderId: "1025454408816",
  appId: "1:1025454408816:web:e8f47b9dc20056859e60b5",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export default app;
export const db = getFirestore(app);

export const provider = new GoogleAuthProvider();
export const auth = getAuth();
