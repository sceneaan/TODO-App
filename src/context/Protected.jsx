import React from "react";
import { UserAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

const Protected = ({ children }) => {
  const { user } = UserAuth();
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
};

export default Protected;
