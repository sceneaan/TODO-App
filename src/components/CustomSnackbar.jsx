import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const CustomSnackbar = ({
  open,
  message,
  onClose,
  vertical,
  horizontal,
  snackbarKey,
  severity,
}) => {
  const [snackPack, setSnackPack] = useState([]);
  const [messageInfo, setMessageInfo] = useState(undefined);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
    } else if (snackPack.length && messageInfo && open) {
      setSnackPack([]);
    }
  }, [snackPack, messageInfo, open]);

  useEffect(() => {
    if (open && message) {
      setSnackPack((prev) => [...prev, { message, snackbarKey, severity }]);
    }
  }, [open, message, snackbarKey, severity]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      key={snackbarKey}
      open={open}
      autoHideDuration={2000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical, horizontal }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={handleSnackbarClose}
        severity={severity}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default CustomSnackbar;
