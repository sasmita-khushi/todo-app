import AsyncStorage from "@react-native-async-storage/async-storage";
//2026-01

export async function fetchMonthlyTodoData(year: number, month: number) {
  // console.log("MONTH", month);
  let days = new Date(year, month + 1, 0).getDate();
  let monthlyTodos = Array(days).fill({
    todos: [],
  });

  let rawData = await AsyncStorage.getItem(`${year}-${month + 1}`);
  if (rawData) {
    try {
      monthlyTodos = JSON.parse(rawData);
    } catch (err) {
      console.log(err);
    }
  }
  console.log(monthlyTodos);
  console.log(monthlyTodos.length);
  return monthlyTodos;
}
