import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCW4pRQefwnVpXzFqv-9BUDZA3nsr4NB-w",
  authDomain: "todo-5692f.firebaseapp.com",
  projectId: "todo-5692f",
  storageBucket: "todo-5692f.appspot.com",
  messagingSenderId: "293190533547",
  appId: "1:293190533547:web:a821c3a8504f9b852792ee",
  measurementId: "G-FFY3D6W77J",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
