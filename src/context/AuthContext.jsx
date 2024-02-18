import { useContext, createContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, firestore } from "../firebase";
import { collection, addDoc, doc, deleteDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const logOut = () => {
    signOut(auth);
  };

  const addTask = async (title, description) => {
    try {
      const userUid = user.uid;
      const taskRef = collection(firestore, "tasks");
      await addDoc(taskRef, {
        title,
        description,
        completed: false,
        favourite: false,
        userUid,
      });
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const taskRef = doc(firestore, "tasks", taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("User: ", currentUser); //to check if its working
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <AuthContext.Provider
      value={{ googleSignIn, logOut, addTask, deleteTask, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
