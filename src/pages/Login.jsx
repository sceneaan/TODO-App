import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import backgroundImage from "../assets/loginBg.png";
import GoogleIconColoured from "../assets/googleIcon.png";
import Logo from "../assets/logo.png";

import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../components/CustomSnackbar";

const Login = () => {
  const { googleSignIn, user } = UserAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      setSnackbarMessage("Login successful");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Login failed. Please check your credentials.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate("/dashboard");
    }
  }, [user]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const headingStyle = {
    fontSize: "33px",
    fontWeight: 500,
    lineHeight: "39px",
    letterSpacing: "0em",
  };

  const descriptionStyle = {
    color: "rgba(0, 0, 0, 0.55)",
    fontSize: "20px",
    fontWeight: 400,
    lineHeight: "30px",
    letterSpacing: "0em",
    paddingLeft: isSmallScreen ? "20px" : "40px",
    paddingRight: isSmallScreen ? "20px" : "40px",
    textAlign: "center",
  };

  return (
    <>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={6}>
          <div style={{ textAlign: "center" }}>
            <img
              src={Logo}
              alt="Logo"
              style={{
                width: isSmallScreen ? "30px" : "44px",
                height: isSmallScreen ? "44.4px" : "65.76px",
                position: "absolute",
                top: isSmallScreen ? "20px" : "80px",
                left: isSmallScreen ? "calc(50% - 15px)" : "108px",
                transform: isSmallScreen ? "translateX(-50%)" : "none",
              }}
            />
            <Typography variant="h4" gutterBottom style={headingStyle}>
              LOGIN
            </Typography>
            <Typography variant="body1" paragraph style={descriptionStyle}>
              Welcome to our Todo application! Log in to your account
              effortlessly and take control of your tasks. Your secure gateway
              to organized living awaits.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              style={{ background: "rgba(89, 126, 247, 1)" }}
              startIcon={
                <img
                  src={GoogleIconColoured}
                  alt="Google Icon"
                  style={{ width: "24px", height: "24px", marginRight: "8px" }}
                />
              }
              onClick={handleGoogleSignIn}
            >
              Sign in using Google
            </Button>
          </div>
        </Grid>

        {!isSmallScreen && (
          <Grid item xs={12} sm={6}>
            <img
              src={backgroundImage}
              alt="Background"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Grid>
        )}
      </Grid>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
        vertical="bottom"
        horizontal="center"
        snackbarKey={Date.now()}
        severity={snackbarSeverity}
      />
    </>
  );
};

export default Login;
