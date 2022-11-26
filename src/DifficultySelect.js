import { green, orange, red } from "@mui/material/colors";
import Radio from "@mui/material/Radio";
import * as React from "react";

function DifficultySelect({ updateSelectFunction }) {
  const [selectedValue, setSelectedValue] = React.useState("");

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

export default DifficultySelect;
