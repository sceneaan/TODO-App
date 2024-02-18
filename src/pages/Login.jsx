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

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      setSnackbarMessage("Logging in");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Login failed. Please check your credentials.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user != null) {
      navigate("/dashboard");
    }
  }, [user]);

  // Responsive design breakpoints
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Styles
  const styles = {
    heading: {
      fontSize: "33px",
      fontWeight: 500,
      lineHeight: "39px",
      letterSpacing: "0em",
    },
    description: {
      color: "rgba(0, 0, 0, 0.55)",
      fontSize: "20px",
      fontWeight: 400,
      lineHeight: "30px",
      letterSpacing: "0em",
      paddingLeft: isSmallScreen ? "20px" : "40px",
      paddingRight: isSmallScreen ? "20px" : "40px",
      textAlign: "center",
    },
    logo: {
      width: isSmallScreen ? "30px" : "35px",
      height: "auto",
      position: "absolute",
      top: isSmallScreen ? "20px" : "30px",
      left: isSmallScreen ? "20px" : "30px",
      transform: "none",
    },
  };

  return (
    <>
      {/* Login Grid */}
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {/* Left Column (Login Form) */}
        <Grid item xs={12} sm={6}>
          <div style={{ textAlign: "center" }}>
            {/* Logo */}
            <img src={Logo} alt="Logo" style={styles.logo} />
            {/* Login Title */}
            <Typography variant="h4" gutterBottom style={styles.heading}>
              LOGIN
            </Typography>
            {/* Login Description */}
            <Typography variant="body1" paragraph style={styles.description}>
              Welcome to our Todo application! Log in to your account
              effortlessly and take control of your tasks. Your secure gateway
              to organized living awaits.
            </Typography>
            {/* Google Sign-In Button */}
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

        {/* Right Column (Background Image) - Displayed only on larger screens */}
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

      {/* Custom Snackbar for displaying messages */}
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
