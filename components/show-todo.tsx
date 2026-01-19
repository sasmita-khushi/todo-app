import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  TextInput,
  ScrollView,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { type Todo } from "@/type";
import { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import CheckBox from "@/check-box";
import { useTodoStore } from "@/store";

// Generate unique id
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function DisplayTodos() {
  console.log("DisplayTodos render");
  // const { todos, day } = props.todoData;
  //console.log(todos, day);
  const { width } = useWindowDimensions();
  const slide = useSharedValue(0);
  const showTodoBox = useTodoStore((state) => state.showTodoBox);
  const setTodoBox = useTodoStore((state) => state.setShowTodoBox);
  const todos = useTodoStore((state) => state.todos);
  const day = useTodoStore((state) => state.selectedDate.getDate());
  //console.log("text...", props);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(slide.value, [0, 1], [0, -width]),
      },
    ],
  }));

  useEffect(() => {
    console.log("useeffect fired");
    console.log("Todos length...", todos.length, showTodoBox);
    if (todos.length > 0 || showTodoBox) {
      slide.value = withTiming(1, { duration: 300 });
    } else {
      slide.value = withTiming(0, { duration: 300 });
    }
  }, [todos, showTodoBox, slide]);

  const handleCreateText = () => {
    //slide.value = withTiming(1, { duration: 300 });
    setTodoBox(true);
  };

  //// if (todos.length === 0) {
  return (
    <Animated.View
      className="flex-row "
      style={[{ width: width * 2 }, animatedStyle]}
    >
      <NoTodoBox handleCreateTodoPress={handleCreateText} width={width} />

      <CreateTodoBox width={width} day={day} />
    </Animated.View>
  );
}
//}

function NoTodoBox({
  width,
  handleCreateTodoPress,
}: {
  handleCreateTodoPress: () => void;
  width: number;
}) {
  return (
    <View className="mt-10  " style={{ width: width }}>
      <View className="bg-gray-200 dark:bg-gray-900 items-center p-3 rounded-2xl mx-4 ">
        <Text className="text-4xl mb-3 mt-7">☀️</Text>

        <Text className="text-lg font-robotoMedium dark:text-white ">
          No text for this day
        </Text>

        <Text className="text-gray-400 text-sm mb-4 text-center font-roboto">
          Add a goal to get started and stay productive!
        </Text>

        <Pressable
          className="px-6 py-3 rounded-full dark:bg-white  bg-gray-800 mb-2"
          onPress={handleCreateTodoPress}
        >
          <Text className=" dark:text-black text-white font-robotoBold ">
            Create Todos
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function CreateTodoBox({ width, day }: { width: number; day: number }) {
  const [text, setText] = useState("");
  // const [todos, setTodos] = useState<Todo[]>([]);
  // const selectedDate = useTodoStore((state) => state.selectedDate);
  const todos = useTodoStore((state) => state.todos);
  //const setTodos = useTodoStore((state) => state.setTodos);
  console.log("CreateTodoBox render", todos);
  const addTodo = useTodoStore((state) => state.addTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);

  const handleAddTodo = () => {
    if (text.trim() !== "") {
      const newTodos = { id: generateId(), completed: false, text: text };

      addTodo(newTodos);
      setText("");
      //updateTodos(day, todosCopy);
    }
  };

  const handleDeleteTodo = (id: string) => {
    // setTodos((prev) => prev.filter((t) => t.id !== id));
    //updateTodos(day, todos);
    removeTodo(id);
  };

  const handleCheck = (id: string) => {
    // setTodos((prev) =>
    //   prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    // );
    //updateTodos(day, todos);
  };

  return (
    <ScrollView>
      <View
        className=" bg-white dark:bg-gray-950 mt-5 flex-1"
        style={{ width: width }}
      >
        <TextInput
          placeholder="write here......"
          className="border border-gray-300  dark:border-gray-600 rounded-lg px-3 py-4 text-black dark:text-white mt-5 mx-4"
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleAddTodo}
          returnKeyType="done"
          placeholderTextColor="#9CA3AF"
        />

        {todos.map((item) => (
          <View
            key={item.id}
            className="mt-6 flex-row items-center dark:bg-gray-900 bg-gray-100 px-3 py-4 rounded-xl mx-4"
          >
            <CheckBox
              checked={item.completed}
              onChange={() => handleCheck(item.id)}
            />

            <Text
              className={`ml-3 flex-1  font-roboto  ${
                item.completed
                  ? "line-through text-gray-400 "
                  : " dark:text-white  text-black"
              }`}
            >
              {item.text}
            </Text>

            <Pressable onPress={() => handleDeleteTodo(item.id)}>
              <Ionicons name="trash-outline" size={22} color={"gray"} />
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
