import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

// CustomSnackbar component definition
const CustomSnackbar = ({
  open,
  message,
  onClose,
  vertical,
  horizontal,
  snackbarKey,
  severity,
}) => {
  // State to manage the snack pack (queue of snack items)
  const [snackPack, setSnackPack] = useState([]);
  // State to manage the currently displayed snack item
  const [messageInfo, setMessageInfo] = useState(undefined);

  // Effect to handle displaying the next snack item
  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
    } else if (snackPack.length && messageInfo && open) {
      setSnackPack([]);
    }
  }, [snackPack, messageInfo, open]);

  // Effect to add a new snack item to the queue
  useEffect(() => {
    if (open && message) {
      setSnackPack((prev) => [...prev, { message, snackbarKey, severity }]);
    }
  }, [open, message, snackbarKey, severity]);

  // Handler for closing the snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    onClose();
  };

  // Render the Snackbar component with MuiAlert
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
