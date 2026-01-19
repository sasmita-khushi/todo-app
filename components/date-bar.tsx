import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import { type Todo } from "./todo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTodoStore } from "@/store";

type DayTodos = {
  todos: Todo[];
};

type MonthTodos = DayTodos[];

type DateBarProps = {
  date: Date; //To know which month (Jan, Feb…)
  //selected: Date; //To highlight the selected day
  onSelectDay: (day: number) => void; //Tell parent: "user selected day X"
  flatListRef: React.RefObject<FlatList<number>>; // Allows parent to control scrolling
  dayBoxWidth?: number;
  dayBoxHeight?: number;
};

export function DateBar({
  date,

  onSelectDay,
  flatListRef,
  dayBoxWidth = 46,
  dayBoxHeight = 60,
}: DateBarProps) {
  const lastDate = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  const monthDays = Array.from({ length: lastDate }, (_, i) => i + 1);

  const ITEM_WIDTH = dayBoxWidth + 10;

  const scrollToDay = (day: number) => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToIndex({
        index: day - 1,
        animated: true,
        viewPosition: 0.5, // center
      });
    });
  };

  const selectedDate = useTodoStore((state) => state.selectedDate);
  useEffect(() => {
    if (selectedDate.getMonth() === date.getMonth()) {
      scrollToDay(selectedDate.getDate());
    } else {
      scrollToDay(1);
    }
  }, [date, selectedDate]);

  // const renderItem = ({ item }: ListRenderItemInfo<number>) => {
  //   const isSelected =
  //     selected.getDate() === item && selected.getMonth() === date.getMonth();
  //   // console.log(item, item - 1);
  //   return (
  //     <Pressable
  //       onPress={() => {
  //         onSelectDay(item);
  //         scrollToDay(item);
  //       }}
  //       style={{ width: dayBoxWidth, height: dayBoxHeight }}
  //       className={`rounded-full items-center justify-center ${
  //         isSelected
  //           ? "bg-gray-800 dark:bg-gray-200"
  //           : "bg-gray-200 dark:bg-gray-900"
  //       }`}
  //     >
  //       <Text
  //         className={`text-lg font-semibold ${
  //           isSelected
  //             ? "text-white dark:text-black"
  //             : "text-gray-800 dark:text-gray-400"
  //         }`}
  //       >
  //         {item}
  //       </Text>
  //     </Pressable>
  //   );
  // };

  return (
    <View className="mt-4">
      <FlatList
        ref={flatListRef}
        data={monthDays}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => {
          return item.toString();
        }}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 10 }}
        renderItem={({ item }) => {
          //console.log("DateBar renderItem", item);
          return (
            <RenderDay
              item={item}
              onSelectDay={onSelectDay}
              date={date}
              dayBoxWidth={dayBoxWidth}
              dayBoxHeight={dayBoxHeight}
              scrollToDay={scrollToDay}
            />
          );
        }}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
      />
    </View>
  );
}

type RenderDayProps = {
  item: number;
  onSelectDay: (day: number) => void;
  date: Date;
  dayBoxWidth: number;
  dayBoxHeight: number;
  scrollToDay: (day: number) => void;
};

const RenderDay = ({
  item,
  onSelectDay,
  date,
  dayBoxWidth,
  dayBoxHeight,
  scrollToDay,
}: RenderDayProps) => {
  const selectedDate = useTodoStore((state) => state.selectedDate);
  const isSelected =
    selectedDate.getDate() === item &&
    selectedDate.getMonth() === date.getMonth();
  //const [dayTodos, setDayTodos] = useState([]);
  const [isThereTodos, setIsThereTodos] = useState(false);
  const isMatched = useRef(false);

  // console.log(item, item - 1);

  const setTodos = useTodoStore((state) => state.setTodos);

  useEffect(() => {
    //console.log("RenderDay render", item);

    let key = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${item}`;
    AsyncStorage.getItem(key).then((todosString) => {
      //console.log("fetched todos for ", key, res);
      // console.log("fetched todos for ", key, todos);
      console.log("Todo String...", todosString);
      if (selectedDate.getDate() === item) {
        setTodos([]);
      }
      if (todosString) {
        const todos: Todo[] = JSON.parse(todosString);
        setIsThereTodos(todos.length > 0);
        console.log(
          "Setting todos for selected day...",
          selectedDate.getDate(),
          item,
          todos
        );
        if (selectedDate.getDate() === item) {
          console.log("Updating store todos...", todos);
          setTodos(todos);
          isMatched.current = true;
        }
      } else {
        //setTodos([]);
        setIsThereTodos(false);
      }
    });
  }, [item, selectedDate, setTodos]);

  return (
    <Pressable
      onPress={() => {
        onSelectDay(item);
        scrollToDay(item);
      }}
      style={{ width: dayBoxWidth, height: dayBoxHeight }}
      className={`rounded-full items-center justify-center ${
        isSelected
          ? "bg-gray-800 dark:bg-gray-200"
          : "bg-gray-200 dark:bg-gray-900"
      }`}
    >
      <Text
        className={`text-lg font-semibold ${
          isSelected
            ? "text-white dark:text-black"
            : "text-gray-800 dark:text-gray-400"
        }`}
      >
        {item}
      </Text>
      {isThereTodos ? (
        <View className="justify-center items-center">
          <Text className="text-xs text-green-500">●</Text>
        </View>
      ) : null}
    </Pressable>
  );
};
