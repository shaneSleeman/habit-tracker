import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";

// Generate Order Data
function createData(id, dateAdded, name, difficulty, completion, completed) {
  return { id, dateAdded, name, difficulty, completion, completed };
}

const rows = [
  createData(0, "16 Mar, 2019", "Exercise", "Hard", "62%", "17 May, 2019"),
  createData(0, "16 Mar, 2019", "Exercise", "Hard", "62%", "17 May, 2019"),
  createData(0, "16 Mar, 2019", "Exercise", "Hard", "62%", "17 May, 2019"),
  createData(0, "16 Mar, 2019", "Exercise", "Hard", "62%", "17 May, 2019"),
  createData(0, "16 Mar, 2019", "Exercise", "Hard", "62%", "17 May, 2019"),
];

function preventDefault(event) {
  event.preventDefault();
}

export default function Habits() {
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
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.dateAdded}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.difficulty}</TableCell>
              <TableCell>{row.completion}</TableCell>
              <TableCell align="right">{row.completed}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
