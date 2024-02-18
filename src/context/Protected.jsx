import React from "react";
import { UserAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

// Define the Protected component
const Protected = ({ children }) => {
  // Retrieve user authentication information from the AuthContext
  const { user } = UserAuth();

  // Check if the user is authenticated
  if (!user) {
    // If not authenticated, navigate to the home page
    return <Navigate to="/" />;
  }

  // If authenticated, render the children components (nested routes)
  return children;
};

// Export the Protected component
export default Protected;
