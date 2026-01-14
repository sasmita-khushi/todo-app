import { View, Text, Pressable, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../context/theme-context";
import { useEffect, useState } from "react";

type CalenderProps = {
  selected?: Date;
  year?: number;
  month?: number;
  onSelectDay?: (day: number, month: number, year: number) => void;
  onClose?: () => void;
};

export default function Calender({
  selected,
  year,
  month,
  onSelectDay,
  onClose,
}: CalenderProps) {
  const { isDark } = useTheme();

  const getInitialDate = () => {
    if (selected) return new Date(selected);
    if (year !== undefined && month !== undefined)
      return new Date(year, month, 1);
    return new Date();
  };

  const [viewDate, setViewDate] = useState<Date>(getInitialDate);

  useEffect(() => {
    if (selected) {
      setViewDate(new Date(selected));
    } else if (year !== undefined && month !== undefined) {
      setViewDate(new Date(year, month, 1));
    }
  }, [selected, year, month]);

  const monthYear = viewDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1
  ).getDay();

  const lastDate = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0
  ).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= lastDate; i++) days.push(i);

  const handlePrevMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));

  const handleNextMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  return (
    <View className="px-4 pt-2 ">
      {/* HEADER */}
      <View className="flex-row justify-between items-center mb-4 pb-2 border-b dark:border-gray-800 border-gray-200">
        <Text className="text-xl font-bold dark:text-white">Select Date</Text>

        {onClose && (
          <Pressable
            onPress={onClose}
            className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full"
          >
            <Ionicons
              name="close-outline"
              size={24}
              color={isDark ? "white" : "black"}
            />
          </Pressable>
        )}
      </View>

      {/* MONTH NAVIGATION */}
      <View className="flex-row items-center justify-between mb-6">
        <Pressable
          onPress={handlePrevMonth}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={isDark ? "white" : "black"}
          />
        </Pressable>

        <Text className="text-lg font-bold dark:text-white">{monthYear}</Text>

        <Pressable
          onPress={handleNextMonth}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
        >
          <Ionicons
            name="chevron-forward"
            size={22}
            color={isDark ? "white" : "black"}
          />
        </Pressable>
      </View>

      {/* WEEK DAYS */}
      <View className="flex-row mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <Text
            key={d}
            style={{ width: `${100 / 7}%` }}
            className="text-center text-gray-400 font-semibold"
          >
            {d}
          </Text>
        ))}
      </View>

      {/* DATE GRID */}
      <View className="flex-row flex-wrap">
        {days.map((day, index) => {
          const isSelected =
            selected &&
            day &&
            selected.getDate() === day &&
            selected.getMonth() === viewDate.getMonth() &&
            selected.getFullYear() === viewDate.getFullYear();

          return (
            <View
              key={index}
              style={{ width: `${100 / 7}%` }}
              className="items-center mb-4"
            >
              {day ? (
                <Pressable
                  onPress={() =>
                    onSelectDay?.(
                      day,
                      viewDate.getMonth(),
                      viewDate.getFullYear()
                    )
                  }
                  className={`h-12 w-12 rounded-full items-center justify-center ${
                    isSelected
                      ? "bg-gray-900 dark:bg-white"
                      : "bg-gray-200 dark:bg-gray-900"
                  }`}
                >
                  <Text
                    className={`font-bold ${
                      isSelected
                        ? "text-white dark:text-black"
                        : "text-black dark:text-gray-200"
                    }`}
                  >
                    {day}
                  </Text>
                </Pressable>
              ) : (
                <View className="h-12 w-12" />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
