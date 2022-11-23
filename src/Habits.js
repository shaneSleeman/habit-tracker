import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";

// Generate Order Data

function preventDefault(event) {
  event.preventDefault();
}

function returnColor(difficulty) {
  if (difficulty == "Easy") return "green";
  else if (difficulty == "Medium") return "orange";
  else return "red";
}

export default function Habits({ habits, deleteFunction }) {
  return (
    <React.Fragment>
      <Title>Habits</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date Added</TableCell>
            <TableCell>Habit</TableCell>
            <TableCell>Difficulty</TableCell>
            <TableCell>Completion</TableCell>
            <TableCell>Remaining</TableCell>
            <TableCell align="right">Date Complete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {habits.map((habit, i) => (
            <TableRow
              key={habit.id}
              sx={{
                "&:hover": {
                  backgroundColor: "lightpink",
                  cursor: "pointer",
                },
                backgroundColor: habit.daysRemain ? "white" : "lightgray",
              }}
              onClick={() => deleteFunction(i)}
            >
              <TableCell>{habit.dateAdded}</TableCell>
              <TableCell>{habit.name}</TableCell>
              <TableCell sx={{ color: `${returnColor(habit.difficulty)}` }}>
                {habit.difficulty}
              </TableCell>
              <TableCell>
                <CircularProgressWithLabel value={habit.completion} />
              </TableCell>
              <TableCell>{habit.daysRemain} Days</TableCell>
              <TableCell align="right">{habit.completed}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}
