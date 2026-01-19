import { create } from "zustand";
import { type Todo } from "../type";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TodoStoreState = {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
  removeTodo: (id: string) => void;
  updateTodo: (updatedTodo: Todo) => void;
  setTodos: (todos: Todo[]) => void;
  showTodoBox: boolean;
  setShowTodoBox: (show: boolean) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

export const useTodoStore = create<TodoStoreState>((set) => ({
  todos: [],
  selectedDate: new Date(),
  showTodoBox: false,
  setSelectedDate: (date: Date) => {
    set({ selectedDate: date });
  },
  addTodo: (todo: Todo) => {
    set((state) => {
      const newTodos = { todos: [...state.todos, todo] };
      let key = `${state.selectedDate.getFullYear()}-${state.selectedDate.getMonth() + 1}-${state.selectedDate.getDate()}`;
      AsyncStorage.setItem(key, JSON.stringify(newTodos.todos));
      return newTodos;
    });
  },

  removeTodo: (id: string) => {
    set((state) => {
      const newTodos = { todos: state.todos.filter((todo) => todo.id !== id) };
      let key = `${state.selectedDate.getFullYear()}-${state.selectedDate.getMonth() + 1}-${state.selectedDate.getDate()}`;
      AsyncStorage.setItem(key, JSON.stringify(newTodos.todos));
      return newTodos;
    });
  },

  updateTodo: (updatedTodo: Todo) => {
    set((state) => {
      const newTodos = {
        todos: state.todos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        ),
      };
      let key = `${state.selectedDate.getFullYear()}-${state.selectedDate.getMonth() + 1}-${state.selectedDate.getDate()}`;
      AsyncStorage.setItem(key, JSON.stringify(newTodos.todos));
      return newTodos;
    });
  },

  setTodos: (todos: Todo[]) => {
    set({ todos });
  },

  setShowTodoBox: (show) => set({ showTodoBox: show }),
}));
