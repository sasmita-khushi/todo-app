import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useRouter, Link } from "expo-router";
import { use, useEffect, useRef, useState } from "react";
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
import { useTodoStore } from "@/store";

type DayTodos = {
  todos: Todo[];
};

type MonthTodos = DayTodos[];

export default function IndexPage() {
  const { isDark, toggleTheme } = useTheme();
  // this is for today date
  const [date, setDate] = useState(new Date());
  // this is used for selected date in date bar
  //const selected = useTodoStore((state) => state.selectedDate);
  const setSelectedDate = useTodoStore((state) => state.setSelectedDate);
  const [selectedMonthDate, setSelectedMonthDate] = useState(new Date());
  const todos = useTodoStore((state) => state.todos);

  const [modalVisible, setModalVisible] = useState(false);
  const setShowTodo = useTodoStore((state) => state.setShowTodoBox);

  const flatListRef = useRef<FlatList<number>>(null) as React.RefObject<
    FlatList<number>
  >;

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
    console.log("newDate", newDate);
    setSelectedDate(newDate);

    setShowTodo(false);

    // Only scroll if we are in the same month as the DateBar view
    scrollToDay(day);
    //setModalVisible(false);
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

    setSelectedDate(newDate);
    setDate(newDate); // Sync the main view date

    // Only scroll if we are in the same month as the DateBar view
    scrollToDay(day);
    setModalVisible(false);
  };

  //console.log("selected", selected.getDate());
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
                  setSelectedDate(today);
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

          <DateBar
            date={date}
            onSelectDay={handleDayPress}
            flatListRef={flatListRef}
          />

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
                //selected={selected}
                onSelectDay={handleDateSelectionFromCalender}
                onClose={() => setModalVisible(false)}
              />
            </View>
          </SafeAreaView>
        </Modal>

        <DisplayTodos />

        {/* <TodoScreen selectedDate={selected} monthTodos={monthTodos} /> */}
      </View>

      <Pressable
        className="absolute bottom-8 right-6 bg-blue-600 rounded-full p-4 shadow-lg"
        onPress={async () => {
          //console.log("button pressed");
          try {
            console.log("Clearing AsyncStorage...");
            let keys = await AsyncStorage.getItem("2026-1-20");
            console.log("Todos....", todos);
            //await AsyncStorage.multiRemove(keys);
            console.log(keys);
          } catch (e) {
            console.log("Error clearing AsyncStorage", e);
          }

          //console.log("Cleared AsyncStorage");
          // You can navigate to a new screen or open a modal to add a new todo
        }}
      >
        <Ionicons name="add" size={24} color="white" />
      </Pressable>
    </>
  );
}
