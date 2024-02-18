import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import SearchComponent from "../components/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase";
import CustomSnackbar from "../components/CustomSnackbar";

const Dashboard = () => {
  // Authentication and User Context
  const { user, logOut, addTask, deleteTask } = UserAuth();

  // State for managing form inputs, tasks, and snackbar
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarKey, setSnackbarKey] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // React Router navigation hook
  const navigate = useNavigate();

  // Material-UI theme and media query
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Styles
  const styles = {
    heading: {
      fontSize: "33px",
      fontWeight: 700,
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
  };

  // Event handler for user sign out
  const handleSignOut = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  // Event handler for adding a task
  const handleAddTask = () => {
    try {
      if (title && description) {
        // Both title and description are filled
        addTask(title, description);
        const key = new Date().getTime();
        setSnackbarSeverity("success");
        setSnackbarMessage("Task added successfully");
        setSnackbarOpen(true);
        setSnackbarKey(key);
        setTitle("");
        setDescription("");
      } else {
        // Either title or description is empty
        setSnackbarSeverity("error");
        setSnackbarMessage("Please fill in both title and description.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Event handler for deleting a task
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setSnackbarSeverity("success");
      setSnackbarMessage("Task deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Failed to delete task.");
      setSnackbarOpen(true);
    }
  };

  // Event handler for checkbox click (task completion)
  const handleCheckboxClick = async (taskId) => {
    try {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );

      setTasks(updatedTasks);

      const taskRef = doc(firestore, "tasks", taskId);
      await updateDoc(taskRef, {
        completed: !tasks.find((task) => task.id === taskId)?.completed,
      });
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  // Event handler for favorite icon click
  const handleFavoriteClick = async (taskId) => {
    try {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, favourite: !task.favourite } : task
      );

      setTasks(updatedTasks);

      const taskRef = doc(firestore, "tasks", taskId);
      await updateDoc(taskRef, {
        favourite: !tasks.find((task) => task.id === taskId)?.favourite,
      });
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  // Fetch tasks on component mount and whenever the user changes
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!user || !user.uid) {
          return;
        }
        const userUid = user.uid;
        const taskRef = collection(firestore, "tasks");
        const unsubscribe = onSnapshot(
          query(
            taskRef,
            where("userUid", "==", userUid),
            orderBy("timestamp", "desc")
          ),
          (snapshot) => {
            const tasksData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setTasks(tasksData);
            setLoading(false);
          }
        );

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    setLoading(true);
    fetchTasks();
  }, [user]);

  // Handle search input change
  const handleSearch = (searchTerm) => {
    setSearchQuery(searchTerm);
  };

  // Filter tasks based on search and filter criteria
  const searchedTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);
  };

  // Apply filters to tasks
  const filteredTasks = searchedTasks.filter((task) => {
    if (filter === "completed") {
      return task.completed === true;
    } else if (filter === "favourite") {
      return task.favourite === true;
    }
    return true;
  });

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Pagination
  const tasksPerPage = 5;
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // Render component
  return (
    <div
      style={{ maxHeight: isSmallScreen ? "60vh" : "none", overflowY: "auto" }}
    >
      {/* Main Grid */}
      <Grid
        item
        container
        spacing={2}
        sx={{ display: "flex", alignItems: "center" }}
        justifyContent="center"
        alignItems="center"
      >
        {/* Left Column */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            paddingRight: isSmallScreen ? "0" : "30px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            {/* Logo */}
            <img
              src={Logo}
              alt="Logo"
              style={{
                width: isSmallScreen ? "30px" : "35px",
                height: "auto",
                position: "absolute",
                top: isSmallScreen ? "20px" : "30px",
                left: isSmallScreen ? "20px" : "30px",
                transform: "none",
              }}
            />
            {/* App Title and Description */}
            <Typography variant="h4" gutterBottom style={styles.heading}>
              TODO
            </Typography>
            <Typography variant="body1" paragraph style={styles.description}>
              Welcome <b>{user?.displayName}</b>!<br /> Seamlessly add,
              organize, and conquer your tasks with just a few clicks. Your
              to-do list, your way.
            </Typography>
            {/* Task Input Form */}
            <div
              style={{
                display: "inline-grid",
                gap: "20px",
                marginTop: "20px",
                justifyItems: "center",
              }}
            >
              <TextField
                id="title"
                label="Title"
                variant="outlined"
                style={{
                  width: isSmallScreen ? "auto" : "378px",
                  height: "64px",
                }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                id="description"
                label="Description"
                variant="outlined"
                style={{
                  width: isSmallScreen ? "auto" : "378px",
                  height: "64px",
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                style={{
                  background: "rgba(89, 126, 247, 1)",
                  width: isSmallScreen ? "auto" : "342px",
                }}
                onClick={handleAddTask}
              >
                Add
              </Button>
              <Button
                variant="outlined"
                style={{ width: isSmallScreen ? "auto" : "342px" }}
                onClick={handleSignOut}
              >
                LOGOUT
              </Button>
            </div>
          </div>
        </Grid>

        {/* Right Column */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            marginTop: isSmallScreen ? "30px" : "0px",
            minHeight: isSmallScreen ? "0px" : "700px",
          }}
        >
          {/* TODO List Heading */}
          <Typography
            variant="h4"
            gutterBottom
            style={{
              fontSize: "25px",
              fontWeight: "700",
              paddingLeft: isSmallScreen ? "20px" : "0px",
            }}
          >
            TODO LIST
          </Typography>
          <div>
            {/* Search and Filter */}
            <Grid
              item
              container
              spacing={3}
              sx={{
                display: isSmallScreen ? "flex" : "",
                padding: "0 30px",
                paddingRight: "30px",
                justifyContent: "start",
                gap: "20%",
                alignItems: "center",
                placeContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <Grid style={{ paddingLeft: isSmallScreen ? "10px" : "0px" }}>
                <SearchComponent onSearch={handleSearch} />
              </Grid>
              <Grid>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    value={filter}
                    onChange={handleFilterChange}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="">
                      <em>Filter By</em>
                    </MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="favourite">Favourite</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Display Tasks */}
            <div style={{ minHeight: isSmallScreen ? "0px" : "500px" }}>
              {loading ? (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <CircularProgress />
                </div>
              ) : currentTasks.length > 0 ? (
                currentTasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      position: "relative",
                      borderBottom: "1px solid gray",
                      marginTop: "10px",
                      padding: isSmallScreen ? "10px" : "0",
                    }}
                  >
                    {/* Task Title */}
                    <Typography
                      variant="h6"
                      style={{ fontSize: "17px", lineHeight: "28px" }}
                      gutterBottom
                    >
                      {task.title}
                    </Typography>
                    {/* Task Description */}
                    <Typography
                      variant="body2"
                      style={{ fontSize: "15px", lineHeight: "28px" }}
                      paragraph
                    >
                      {task.description}
                    </Typography>
                    {/* Task Actions (Checkbox, Favorite, Delete) */}
                    <div style={{ position: "absolute", right: "0", top: "0" }}>
                      <Checkbox
                        onClick={() => handleCheckboxClick(task.id)}
                        checked={task.completed === true}
                      />
                      <IconButton
                        onClick={() => handleFavoriteClick(task.id)}
                        style={{ color: task.favourite ? "red" : "gray" }}
                      >
                        <FavoriteIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteTask(task.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  No tasks available.
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredTasks.length > tasksPerPage && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Pagination
                  count={Math.ceil(filteredTasks.length / tasksPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </div>
            )}
          </div>
        </Grid>
      </Grid>

      {/* Custom Snackbar */}
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
        vertical="bottom"
        horizontal="center"
        key={snackbarKey}
        severity={snackbarSeverity}
      />
    </div>
  );
};

export default Dashboard;
