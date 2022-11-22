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
  return { id, dateAdded, name, difficulty, completion, daysRemain, completed };
}

export default Habit;
