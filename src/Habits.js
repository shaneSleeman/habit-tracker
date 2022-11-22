import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";

// Generate Order Data

function preventDefault(event) {
  event.preventDefault();
}

export default function Habits({ habits }) {
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
            <TableCell align="right">Date Complete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {habits.map((habit) => (
            <TableRow key={habit.id}>
              <TableCell>{habit.dateAdded}</TableCell>
              <TableCell>{habit.name}</TableCell>
              <TableCell>{habit.difficulty}</TableCell>
              <TableCell>{habit.completion}</TableCell>
              <TableCell align="right">{habit.completed}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
