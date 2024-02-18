import { useContext, createContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, firestore } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

// Create a context for managing authentication state
const AuthContext = createContext();

// AuthContextProvider functional component definition
export const AuthContextProvider = ({ children }) => {
  // State to store user information
  const [user, setUser] = useState({});

  // Function to initiate Google sign-in process
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  // Function to log out the user
  const logOut = () => {
    signOut(auth);
  };

  // Function to add a task to the Firestore database
  const addTask = async (title, description) => {
    try {
      const userUid = user.uid;
      const taskRef = collection(firestore, "tasks");
      // Add task with server timestamp for creation time
      await addDoc(taskRef, {
        title,
        description,
        completed: false,
        favourite: false,
        userUid,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  // Function to delete a task from the Firestore database
  const deleteTask = async (taskId) => {
    try {
      const taskRef = doc(firestore, "tasks", taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  // Effect hook to subscribe to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("User: ", currentUser); // Log user information for checking
    });
    // Unsubscribe when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  // Provide authentication-related functions and user information to children components
  return (
    <AuthContext.Provider
      value={{ googleSignIn, logOut, addTask, deleteTask, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// UserAuth functional component to access authentication context
export const UserAuth = () => {
  return useContext(AuthContext);
};
