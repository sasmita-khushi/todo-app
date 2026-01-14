export type Todo = {
  text: string;
  completed: boolean;
  id: string;
};

export type DayTodos = {
  date: string;
  todos: Todo[];
};

export type MonthTodos = DayTodos[];
