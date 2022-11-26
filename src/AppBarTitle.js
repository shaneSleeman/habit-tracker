import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import React from "react";

const AppBarTitle = ({ toggleFunction, openFunction }) => {
  return (
    <AppBar position="absolute" open={openFunction}>
      <Toolbar
        sx={{
          pr: "24px", // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleFunction}
          sx={{
            marginRight: "36px",
            ...(openFunction && { display: "none" }),
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
            sx={{ flexGrow: 1, justifyContent: "center" }}
          >
            Habit Tracker
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarTitle;
