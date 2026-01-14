import React, { useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import { type Todo } from "./todo";

type DayTodos = {
  todos: Todo[];
};

type MonthTodos = DayTodos[];

type DateBarProps = {
  date: Date; //To know which month (Jan, Feb…)
  selected: Date; //To highlight the selected day
  onSelectDay: (day: number) => void; //Tell parent: "user selected day X"
  flatListRef: React.RefObject<FlatList<number>>; // Allows parent to control scrolling
  dayBoxWidth?: number;
  dayBoxHeight?: number;
  monthlyData: MonthTodos;
};

export function DateBar({
  monthlyData,
  date,
  selected,
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

  useEffect(() => {
    if (selected.getMonth() === date.getMonth()) {
      scrollToDay(selected.getDate());
    } else {
      scrollToDay(1);
    }
  }, [date]);

  const renderItem = ({ item }: ListRenderItemInfo<number>) => {
    const isSelected =
      selected.getDate() === item && selected.getMonth() === date.getMonth();
    // console.log(item, item - 1);
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

          {monthlyData[item - 1].todos.length > 0 ? "a" : ""}
        </Text>
      </Pressable>
    );
  };

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
        renderItem={renderItem}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
      />
    </View>
  );
}
