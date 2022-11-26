import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddIcon from "@mui/icons-material/Add";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CreateIcon from "@mui/icons-material/Create";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

import Popup from "reactjs-popup";

import Habits from "./Habits";
import Habit from "./Habit";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";

import Copyright from "./Copyright";
import DifficultySelect from "./DifficultySelect";

// Shortens username display
function excludeAt(s) {
  let newS = "";
  for (let i = 0; i < s.length; i++) {
    if (s.charAt(i) != "@") newS += s.charAt(i);
    else return newS;
  }
}

const drawerWidth = 240;

// Styling and theming from MUI
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

export default function Dashboard() {
  const [habits, setHabits] = React.useState([]);
  const [newHabit, setHabit] = React.useState("");
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [userName, setUserName] = React.useState("Guest@");
  const [signinError, setSigninError] = React.useState("");
  const [signupError, setSignupError] = React.useState("");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState("Easy");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Update any change with the database, once newHabits is fed
  const updateDatabase = async (newHabits) => {
    try {
      let thisDate = new Date().getTime();
      const docRef = await addDoc(collection(db, `${userName}`), {
        habits: newHabits,
        date: thisDate,
      });
    } catch (e) {}
  };

  // Fetch data for user, once newUser is fed
  const fetchUser = async (newUser) => {
    let latestDate = 0;
    let latestData;

    await getDocs(collection(db, `${newUser}`)).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().date > latestDate) {
          latestDate = doc.data().date;
          latestData = doc.data().habits;
          setHabits(latestData);
        }
      });
    });
  };

  React.useEffect(() => {
    // Set data with signed in user
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.email);
        fetchUser(user.email);
      } else {
        setUserName("Guest@");
        fetchUser("Guest@");
      }
    });

    // If loaded with small screen width, have smaller sidebar
    if (window.innerWidth < 760) setOpen(false);
  }, []);

  // Update name of habit whenever field changes
  function changeHabit(event) {
    setHabit(event.target.value);
  }

  // Signup function
  const onSubmit = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setSignupError("");
        const user = userCredential.user;
      })
      .catch((error) => {
        setSignupError("Invalid email, weak password, or user exists.");
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  // Signin function
  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setSigninError("");
        const user = userCredential.user;
        userName = email;
      })
      .catch((error) => {
        if (!error.message.includes("constant"))
          setSigninError("User does not exist, or wrong password.");
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  // Logout function
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUserName("Guest@");
      })
      .catch((error) => {});
  };

  // Add habit to state
  function addHabit(newHabit) {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let dateString = day + "/" + (month + 1) + "/" + year;
    let newHabitObject = Habit(
      0,
      dateString,
      newHabit,
      selectedDifficulty,
      0,
      "-"
    );
    if (newHabit != "" && selectedDifficulty != "") {
      setHabits((habits) => [...habits, newHabitObject]);
      updateDatabase([...habits, newHabitObject]);
    }
    setHabit("");
  }

  // Remove habit from state
  const deleteHabit = (i) => {
    setHabits((habits) => habits.filter((habit, n) => n !== i));
    updateDatabase(habits.filter((habit, n) => n !== i));
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <CheckBoxIcon />
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Habit Tracker
              </Typography>
            </div>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <React.Fragment>
              <Popup
                trigger={
                  <ListItemButton>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add Habit" />
                  </ListItemButton>
                }
                position="right top"
              >
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <TextField
                      id="standard-basic"
                      label="Habit"
                      variant="standard"
                      onChange={changeHabit}
                    />
                    <Typography variant="body2" sx={{ marginTop: "10px" }}>
                      Difficulty
                    </Typography>
                    <DifficultySelect
                      updateSelectFunction={setSelectedDifficulty}
                    />
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => addHabit(newHabit)}>
                      Add
                    </Button>
                  </CardActions>
                </Card>
              </Popup>
              <Popup
                trigger={
                  <ListItemButton>
                    <ListItemIcon>
                      <CheckBoxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Daily Report" />
                  </ListItemButton>
                }
                position="right top"
              >
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography variant="p" component="h3">
                      How well did you perform today?
                    </Typography>
                    <Typography variant="body2" component="h4">
                      Missed habits will be incurred a 2 day penalty.
                    </Typography>
                    <FormGroup>
                      {habits.map((habit, i) => (
                        <FormControlLabel
                          control={
                            <>
                              <Button
                                onClick={() => {
                                  const newHabits = habits.map((habit, i2) => {
                                    let difficultyDays;
                                    if (habit.difficulty == "Easy")
                                      difficultyDays = 18;
                                    else if (habit.difficulty == "Medium")
                                      difficultyDays = 66;
                                    else difficultyDays = 254;

                                    let date = new Date();
                                    let day = date.getDate();
                                    let month = date.getMonth();
                                    let year = date.getFullYear();
                                    let dateString =
                                      day + "/" + (month + 1) + "/" + year;
                                    if (habit.daysRemain > 1) dateString = "-";
                                    if (i == i2 && habit.daysRemain > 0) {
                                      return Habit(
                                        habit.id,
                                        habit.dateAdded,
                                        habit.name,
                                        habit.difficulty,
                                        parseInt(habit.daysComplete) + 1,
                                        dateString
                                      );
                                    } else
                                      return Habit(
                                        habit.id,
                                        habit.dateAdded,
                                        habit.name,
                                        habit.difficulty,
                                        parseInt(habit.daysComplete),
                                        dateString
                                      );
                                  });
                                  setHabits(newHabits);
                                  updateDatabase(newHabits);
                                }}
                                sx={{ marginTop: "5px", marginRight: "5px" }}
                                variant="outlined"
                                color="success"
                              >
                                Completed
                              </Button>
                              <Button
                                sx={{ marginTop: "5px", marginRight: "5px" }}
                                variant="outlined"
                                color="error"
                                onClick={() => {
                                  const newHabits = habits.map((habit, i2) => {
                                    let difficultyDays;
                                    if (habit.difficulty == "Easy")
                                      difficultyDays = 18;
                                    else if (habit.difficulty == "Medium")
                                      difficultyDays = 66;
                                    else difficultyDays = 254;

                                    if (i == i2 && habit.daysComplete > 0) {
                                      return Habit(
                                        habit.id,
                                        habit.dateAdded,
                                        habit.name,
                                        habit.difficulty,
                                        parseInt(habit.daysComplete) - 2 < 0
                                          ? 0
                                          : parseInt(habit.daysComplete) - 2,
                                        "-"
                                      );
                                    } else
                                      return Habit(
                                        habit.id,
                                        habit.dateAdded,
                                        habit.name,
                                        habit.difficulty,
                                        parseInt(habit.daysComplete),
                                        "-"
                                      );
                                  });
                                  setHabits(newHabits);
                                  updateDatabase(newHabits);
                                }}
                              >
                                Missed
                              </Button>
                            </>
                          }
                          label={habit.name}
                        />
                      ))}
                    </FormGroup>
                  </CardContent>
                </Card>
              </Popup>
            </React.Fragment>
            <Divider sx={{ my: 1 }} />
            <React.Fragment>
              <ListItemButton>
                <ListItemIcon>
                  <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText primary={excludeAt(userName)} />
              </ListItemButton>
              <Popup
                trigger={
                  <ListItemButton>
                    <ListItemIcon>
                      <PersonAddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sign In" />
                  </ListItemButton>
                }
                position="right top"
              >
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <TextField
                      id="standard-basic"
                      label="Email"
                      variant="standard"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </CardContent>
                  <CardContent sx={{ marginTop: "-20px" }}>
                    <TextField
                      id="standard-basic"
                      label="Password"
                      variant="standard"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Typography
                      variant="body2"
                      color="red"
                      sx={{ marginTop: "10px" }}
                    >
                      {signinError}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={onLogin}>
                      Sign In
                    </Button>
                  </CardActions>
                </Card>
              </Popup>
              <Popup
                trigger={
                  <ListItemButton>
                    <ListItemIcon>
                      <CreateIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sign Up" />
                  </ListItemButton>
                }
                position="right top"
              >
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <TextField
                      id="standard-basic"
                      label="Email"
                      variant="standard"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </CardContent>
                  <CardContent sx={{ marginTop: "-20px" }}>
                    <TextField
                      id="standard-basic"
                      label="Password"
                      type="password"
                      variant="standard"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Typography
                      variant="body2"
                      color="red"
                      sx={{ marginTop: "10px" }}
                    >
                      {signupError}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={onSubmit}>
                      Sign Up
                    </Button>
                  </CardActions>
                </Card>
              </Popup>

              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Log Out" />
              </ListItemButton>
            </React.Fragment>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Habits habits={habits} deleteFunction={deleteHabit} />
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
