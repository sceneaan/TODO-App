import {
  Button,
  Checkbox,
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
// import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase";
import CustomSnackbar from "../components/CustomSnackbar";

const Dashboard = () => {
  const { user, logOut, addTask, deleteTask } = UserAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarKey, setSnackbarKey] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const headingStyle = {
    fontSize: "33px",
    fontWeight: 700,
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

  const handleSignOut = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTask = () => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    try {
      if (title && description) {
        addTask(title, description);
        const key = new Date().getTime();
        setSnackbarMessage("Task added successfully");
        setSnackbarOpen(true);
        setSnackbarKey(key);
      } else {
        console.log("Failed to add task");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setSnackbarMessage("Task deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!user || !user.uid) {
          return;
        }
        const userUid = user.uid;
        const taskRef = collection(firestore, "tasks");
        const unsubscribe = onSnapshot(
          query(taskRef, where("userUid", "==", userUid)),
          (snapshot) => {
            const tasksData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setTasks(tasksData);
          }
        );

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    fetchTasks();
  }, [user]);

  const handleSearch = (searchTerm) => {
    setSearchQuery(searchTerm);
  };

  const searchedTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);
  };

  const filteredTasks = searchedTasks.filter((task) => {
    if (filter === "completed") {
      return task.completed === true;
    } else if (filter === "favourite") {
      return task.favourite === true;
    }
    return true;
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div
      style={{ maxHeight: isSmallScreen ? "60vh" : "none", overflowY: "auto" }}
    >
      <Grid
        item
        container
        spacing={2}
        sx={{ display: "flex", alignItems: "center" }}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={6} sx={{ borderRight: "1px solid gray" }}>
          <div style={{ textAlign: "center" }}>
            <img
              src={Logo}
              alt="Logo"
              style={{
                width: isSmallScreen ? "30px" : "44px", // Adjust the width for mobile view
                height: isSmallScreen ? "44.64px" : "65.76px",
                position: "absolute",
                top: "80px",
                left: "108px",
                transform: "none",
              }}
            />
            <Typography variant="h4" gutterBottom style={headingStyle}>
              TODO
            </Typography>
            <Typography variant="body1" paragraph style={descriptionStyle}>
              Welcome <b>{user?.displayName}</b>!<br /> Seamlessly add,
              organize, and conquer your tasks with just a few clicks. Your
              to-do list, your way.
            </Typography>
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
                style={{ width: "378px", height: "64px" }}
              />
              <TextField
                id="description"
                label="Description"
                variant="outlined"
                style={{ width: "378px", height: "64px" }}
              />
              <Button
                variant="contained"
                color="primary"
                style={{ background: "rgba(89, 126, 247, 1)", width: "342px" }}
                onClick={handleAddTask}
              >
                Add
              </Button>
              <Button
                variant="outlined"
                style={{ width: "342px" }}
                onClick={handleSignOut}
              >
                LOGOUT
              </Button>
            </div>
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", flexDirection: "column", gap: "30px" }}
        >
          <Typography
            variant="h4"
            gutterBottom
            style={{
              fontSize: "25px",
              fontWeight: "700",
            }}
          >
            TODO LIST
          </Typography>
          <div>
            <Grid
              item
              container
              spacing={3}
              sx={{
                padding: "0 30px",
                paddingRight: "30px",
                justifyContent: "start",
                gap: "20%",
                alignItems: "center",
                placeContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <Grid>
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
            <div>
              {currentTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    position: "relative",
                    borderBottom: "1px solid gray",
                    marginTop: "10px",
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{ fontSize: "17px", lineHeight: "28px" }}
                    gutterBottom
                  >
                    {task.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ fontSize: "15px", lineHeight: "28px" }}
                    paragraph
                  >
                    {task.description}
                  </Typography>

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
                    {/* <IconButton>
                      <EditIcon />
                    </IconButton> */}
                    <IconButton onClick={() => handleDeleteTask(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
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
          </div>
        </Grid>
      </Grid>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
        vertical="bottom"
        horizontal="center"
        key={snackbarKey}
      />
    </div>
  );
};

export default Dashboard;
