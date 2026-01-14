import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useRouter, Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/theme-context";
import TodoScreen, { type Todo } from "../components/todo";
import Calender from "@/components/calender";
import { DateBar } from "@/components/date-bar";
import { FadeInUp, FadeInDown } from "react-native-reanimated";
import { fetchMonthlyTodoData } from "@/utility";
import DisplayTodos from "@/components/show-todo";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DayTodos = {
  todos: Todo[];
};

type MonthTodos = DayTodos[];

export default function IndexPage() {
  const { isDark, toggleTheme } = useTheme();
  // this is for today date
  const [date, setDate] = useState(new Date());
  // this is used for selected date in date bar
  const [selected, setSelected] = useState(new Date());
  const [selectedMonthDate, setSelectedMonthDate] = useState(new Date());

  const [modalVisible, setModalVisible] = useState(false);
  const [monthTodos, setMonthTodos] = useState<MonthTodos>([]);
  const [isMonthlyDataLoaded, setIsMonthlyDataLoaded] = useState(false);

  const [selectedDateTodos, setSelectedDateTodos] = useState<{
    todos: Todo[];
    day: number;
  }>({ day: -1, todos: [] });

  useEffect(() => {
    //console.log("selected is", selected);
    //let yearMonth = `${selected.getFullYear()}-${selected.getMonth()}`;
    setIsMonthlyDataLoaded(false);
    fetchMonthlyTodoData(
      selectedMonthDate.getFullYear(),
      selectedMonthDate.getMonth()
    ).then((monthlyTodos: MonthTodos) => {
      console.log("fetching monthly data -", monthlyTodos);
      setMonthTodos(monthlyTodos);
      setIsMonthlyDataLoaded(true);
    });
  }, [selectedMonthDate]);

  useEffect(() => {
    if (isMonthlyDataLoaded) {
      const day = selected.getDate() - 1;
      const dayTodos = { todos: monthTodos[day].todos, day };
      setSelectedDateTodos(dayTodos);
    }
  }, [selected, isMonthlyDataLoaded, monthTodos]);

  const flatListRef = useRef<FlatList<number>>(null) as React.RefObject<
    FlatList<number>
  >;

  //console.log("Selected", selected);

  // const selectedDateKey = selected.toISOString().split("T")[0];
  // console.log(selectedDateKey);
  // const dayEntry = monthTodos.find((day) => day.date === selectedDateKey);
  // const todosForSelectedDay = dayEntry?.todos ?? [];

  const monthYear = date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const lastDate = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const scrollToDay = (day: number) => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToIndex({
        index: day - 1,
        animated: true,
        viewPosition: 0.5,
      });
    });
  };
  const handleDayPress = (day: number, month?: number, year?: number) => {
    console.log(".........");
    const newMonth = month ?? date.getMonth();
    const newYear = year ?? date.getFullYear();

    const newDate = new Date(newYear, newMonth, day);

    setSelected(newDate);
    setDate(newDate); // Sync the main view date

    // setSelectedMonthDate(newDate);

    // Only scroll if we are in the same month as the DateBar view
    scrollToDay(day);
    setModalVisible(false);
  };

  const handleDateSelectionFromCalender = (
    day: number,
    month: number,
    year: number
  ) => {
    //console.log("selected---->>>>", year, month, day);

    console.log("---------->", selectedMonthDate.getMonth(), month);
    // console.log("month", month);
    const newDate = new Date(year, month, day);

    //to avoid unnecessary fetching the the same month

    if (
      selectedMonthDate.getMonth() !== month ||
      year !== selectedMonthDate.getFullYear()
    ) {
      setSelectedMonthDate(newDate);
    }

    setSelected(newDate);
    setDate(newDate); // Sync the main view date
    // setSelectedMonthDate(newDate);

    // Only scroll if we are in the same month as the DateBar view
    scrollToDay(day);
    setModalVisible(false);
  };

  const handleUpdateTodo = async (day: number, todos: Todo[]) => {
    console.log("parent updateTodo called", day, todos);
    let monthTodoCopy = [...monthTodos];
    monthTodoCopy[day].todos = todos;
    console.log("--------------", monthTodoCopy);
    setMonthTodos(monthTodoCopy);
    const year = selected.getFullYear();
    const month = selected.getMonth() + 1;
    console.log("year", year, "month", month);

    await AsyncStorage.setItem(
      `${year}-${month}`,
      JSON.stringify(monthTodoCopy)
    );
  };

  console.log("selected", selected.getDate());
  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerLeft: () => (
            <Pressable onPress={() => setModalVisible(true)}>
              <View className="flex-row items-center ml-4">
                <Text className="text-lg font-semibold text-black dark:text-gray-200">
                  {monthYear.toUpperCase()}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={18}
                  style={{ marginLeft: 8 }}
                  color={isDark ? "white" : "black"}
                />
              </View>
            </Pressable>
          ),
          headerRight: () => (
            <View className="flex-row items-center mr-3">
              <Pressable
                className="px-4 py-1 rounded-full bg-gray-800 dark:bg-white mr-3"
                onPress={() => {
                  const today = new Date();
                  setDate(today);
                  setSelected(today);
                  scrollToDay(today.getDate());
                }}
              >
                <Text className="text-lg font-robotoMedium text-white dark:text-slate-950">
                  Today
                </Text>
              </Pressable>
              <Pressable onPress={toggleTheme}>
                <Ionicons
                  name={isDark ? "sunny-outline" : "moon-outline"}
                  size={24}
                  className="text-black dark:text-white"
                  color={isDark ? "white" : "black"}
                />
              </Pressable>
            </View>
          ),
        }}
      />

      <View className="flex-1 bg-white dark:bg-gray-950">
        {/* Main Content (Horizontal List) */}
        <View className="mt-4">
          <View className="flex-row mb-2">
            <Text
              className="dark:text-white ml-8 text-3xl font-robotoBold
             text-gray-800"
            >
              DAY {date.getDate()}
            </Text>
            <Text className="dark:text-gray-400 text-xl ml-1 self-end mb-1">
              / {lastDate}
            </Text>
          </View>
          {isMonthlyDataLoaded && (
            <DateBar
              date={date}
              selected={selected}
              onSelectDay={handleDayPress}
              monthlyData={monthTodos}
              flatListRef={flatListRef}
            />
          )}

          {/* <Link href="/foo">go to foo</Link> */}
        </View>

        {/* MODAL SECTION - FIX APPLIED HERE */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setModalVisible(false)}
          transparent
        >
          <SafeAreaView edges={["top"]}>
            <View className="bg-white dark:bg-gray-950">
              <Calender
                selected={selected}
                onSelectDay={handleDateSelectionFromCalender}
                onClose={() => setModalVisible(false)}
              />
            </View>
          </SafeAreaView>
        </Modal>

        {isMonthlyDataLoaded ? (
          <DisplayTodos
            todoData={selectedDateTodos!}
            updateTodo={handleUpdateTodo}
          />
        ) : null}
        {/* <TodoScreen selectedDate={selected} monthTodos={monthTodos} /> */}
      </View>
    </>
  );
}
