import CheckBox from "@/check-box";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef, useState, useEffect } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Generate unique id
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export type Todo = {
  text: string;
  completed: boolean;
  id: string;
};

type DayTodos = {
  date: string;
  todos: Todo[];
};

type MonthTodos = DayTodos[];

type Props = {
  selectedDate: Date;
  monthTodos: MonthTodos;
};

export default function TodoScreen({ selectedDate, monthTodos }: Props) {
  const { width } = useWindowDimensions();

  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const slide = useSharedValue(0);

  const ref = useRef<TextInput>(null);

  const selectedDateKey = selectedDate.toISOString().split("T")[0];
  const dayEntry = monthTodos.find((d) => d.date === selectedDateKey);
  const todosForDay = dayEntry?.todos ?? [];

  const storageMonthKey = selectedDate.toISOString().slice(0, 7);

  useEffect(() => {
    const loadTodos = async () => {
      const saved = await AsyncStorage.getItem(storageMonthKey);
      if (saved) {
        setTodos(JSON.parse(saved));
      }
    };
    loadTodos();
  }, [storageMonthKey]);

  // Animation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(slide.value, [0, 1], [0, -width]),
      },
    ],
  }));

  const handleCreateTodo = () => {
    slide.value = withTiming(1, { duration: 300 });
    setTimeout(() => ref.current?.focus(), 300);
  };

  const handleAddTodo = () => {
    if (!text.trim()) return;

    setTodos((prev) => [...prev, { id: generateId(), text, completed: false }]);
    setText("");
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <View className="flex-1 dark:bg-gray-950 bg-white overflow-hidden">
      <Animated.View
        style={[
          {
            flexDirection: "row",
            width: width * 2,
          },
          animatedStyle,
        ]}
      >
        {/* ================= FIRST SCREEN ================= */}
        <ScrollView
          style={{ width }}
          contentContainerStyle={{
            padding: 20,
            flexGrow: 1,
          }}
          className="bg-gray-950"
        >
          {todosForDay.length === 0 ? (
            <View className="items-center bg-gray-900 rounded-3xl p-6">
              <Text className="text-4xl mb-3">☀️</Text>

              <Text className="text-xl font-robotoMedium text-white mb-1">
                No goals for today
              </Text>

              <Text className="text-gray-400 mb-4 text-center">
                Add a goal to get started and stay productive!
              </Text>

              <Pressable
                onPress={handleCreateTodo}
                className="px-6 py-3 rounded-full bg-white"
              >
                <Text className="text-black font-robotoBold">Create Todo</Text>
              </Pressable>
            </View>
          ) : (
            todosForDay.map((todo) => (
              <View
                key={todo.id}
                className="bg-gray-900 p-4 rounded-xl mb-3 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1">
                  <CheckBox checked={todo.completed} onChange={() => {}} />
                  <Text
                    className={`ml-4 text-base text-white ${
                      todo.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {todo.text}
                  </Text>
                </View>

                <Pressable onPress={() => handleDeleteTodo(todo.id)}>
                  <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                </Pressable>
              </View>
            ))
          )}
        </ScrollView>

        {/* ================= SECOND SCREEN ================= */}
        <ScrollView
          style={{ width }}
          contentContainerStyle={{
            padding: 20,
            flexGrow: 1,
          }}
          className="bg-gray-950"
        >
          <View className="bg-gray-900 p-5 rounded-2xl">
            <Text className="text-xl font-robotoBold mb-4 text-white">
              Create Todo
            </Text>

            <TextInput
              ref={ref}
              placeholder="Write your todo..."
              placeholderTextColor="#9CA3AF"
              value={text}
              onChangeText={setText}
              returnKeyType="done"
              onSubmitEditing={handleAddTodo}
              className="border border-gray-700 rounded-lg px-3 py-3 text-white"
            />

            {todos.map((item) => (
              <View
                key={item.id}
                className="mt-6 flex-row items-center bg-gray-800 p-3 rounded-xl"
              >
                <CheckBox
                  checked={item.completed}
                  onChange={() =>
                    setTodos((prev) =>
                      prev.map((t) =>
                        t.id === item.id ? { ...t, completed: !t.completed } : t
                      )
                    )
                  }
                />

                <Text
                  className={`ml-3 flex-1 ${
                    item.completed ? "line-through text-gray-400" : "text-white"
                  }`}
                >
                  {item.text}
                </Text>

                <Pressable onPress={() => handleDeleteTodo(item.id)}>
                  <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
