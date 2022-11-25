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
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { green, orange, red } from "@mui/material/colors";
import Radio from "@mui/material/Radio";
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

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/shaneSleeman">
        Shane Sleeman's Github
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function excludeAt(s) {
  let newS = "";
  for (let i = 0; i < s.length; i++) {
    if (s.charAt(i) != "@") newS += s.charAt(i);
    else return newS;
  }
}

const drawerWidth = 240;

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

  const [userName, setUserName] = React.useState("Guest");

  const [signinError, setSigninError] = React.useState("");
  const [signupError, setSignupError] = React.useState("");

  const [currentUser, setCurrentUser] = React.useState();

  // Update any change with the database
  const updateDatabase = async () => {
    try {
      let thisDate = new Date().getTime();
      const docRef = await addDoc(collection(db, `${userName}`), {
        habits: habits,
        date: thisDate,
      });
      console.log("Document written with ID: ", docRef.id);
      console.log("doc written with date", thisDate);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Fetch data for user
  const fetchUser = async () => {
    let latestDate = 0;
    let latestData;
    await getDocs(collection(db, `${userName}`)).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().date > latestDate) {
          console.log("got here");
          latestDate = doc.data().date;
          latestData = doc.data().habits;
          console.log(doc.data().date);
          console.log(doc.data().habits);
          setHabits(latestData);
          //setHabits(latestData);
        }

        // Close
        //setHabits(doc.data().habits);
      });

      console.log(latestData);

      // Location of cut-paste working!!
    });
  };

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log(user.email);
        setUserName(user.email);
        setCurrentUser(user);
        // ...
      } else {
        // User is signed out
        // ...
        userName = "Guest@";
      }
      fetchUser();
    });
    if (window.innerWidth < 760) setOpen(false);
  }, []);

  const [selectedDifficulty, setSelectedDifficulty] = React.useState("Easy");

  function changeHabit(event) {
    setHabit(event.target.value);
  }

  // Signup function
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const onSubmit = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setSignupError("");
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        setSignupError("Invalid email, weak password, or user exists.");
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
  };

  // Signin function
  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setSigninError("");
        // Signed in
        const user = userCredential.user;
        console.log(user);
        userName = email;
      })
      .catch((error) => {
        if (!error.message.includes("constant"))
          setSigninError("User does not exist, or wrong password.");
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  // Logout function
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Signed out successfully");
        setUserName("Guest@");
      })
      .catch((error) => {
        // An error happened.
      });
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
      updateDatabase();
    }
    setHabit("");
  }

  const deleteHabit = (i) => {
    setHabits((habits) => habits.filter((habit, n) => n !== i));
    updateDatabase();
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
                                    console.log(habit.name);
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
                                    console.log(habit.daysRemain);
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
                                  updateDatabase();
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
                                    console.log(habit.name);
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
                                  updateDatabase();
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
              {/* Recent Orders */}
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

function DifficultySelect({ updateSelectFunction }) {
  const [selectedValue, setSelectedValue] = React.useState("");
  //updateSelectFunction("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    updateSelectFunction(event.target.value);
  };

  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: "color-radio-button-demo",
    inputProps: { "aria-label": item },
  });

  return (
    <div>
      <Radio
        {...controlProps("Easy")}
        sx={{
          color: green[800],
          "&.Mui-checked": {
            color: green[600],
          },
        }}
      />
      <Radio
        {...controlProps("Medium")}
        sx={{
          color: orange[800],
          "&.Mui-checked": {
            color: orange[600],
          },
        }}
      />
      <Radio
        {...controlProps("Hard")}
        sx={{
          color: red[800],
          "&.Mui-checked": {
            color: red[600],
          },
        }}
      />
    </div>
  );
}
