function Habit(
  id,
  dateAdded,
  name,
  difficulty,
  completion,
  daysRemain,
  completed
) {
  return { id, dateAdded, name, difficulty, completion, daysRemain, completed };
}

export default Habit;
