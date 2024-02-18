import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { AuthContextProvider } from "./context/AuthContext";
import Protected from "./context/Protected";

function App() {
  return (
    <>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
