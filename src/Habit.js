function Habit(id, dateAdded, name, difficulty, daysComplete, completed) {
  let completion;
  let daysRemain;
  if (difficulty == "Easy") {
    completion = (daysComplete / 18) * 100;
    daysRemain = 18 - daysComplete;
  } else if (difficulty == "Medium") {
    completion = (daysComplete / 66) * 100;
    daysRemain = 66 - daysComplete;
  } else if (difficulty == "Hard") {
    completion = (daysComplete / 254) * 100;
    daysRemain = 254 - daysComplete;
  }
  /*
  function addDay() {
    daysComplete++;
  }
  function removeDay() {
    daysComplete -= 2;
    if (daysComplete < 0) daysComplete = 0;
  }*/
  return {
    id,
    dateAdded,
    name,
    difficulty,
    completion,
    daysComplete,
    daysRemain,
    completed,
  };
}

export default Habit;
