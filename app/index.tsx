import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/theme-context";

export default function Calender() {
  const DAY_BOX_WIDTH = 46;
  const DAY_BOX_HEIGHT = 60;
  const { isDark, toggleTheme } = useTheme();
  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<number>>(null);

  const monthYear = date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const lastDate = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  const monthDays = Array.from({ length: lastDate }, (_, i) => i + 1);

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= lastDate; i++) days.push(i);
  while (days.length < 42) days.push(null);

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [date]);

  const scrollToDay = (day: number) => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToIndex({
        index: day - 1,
        animated: true,
        viewPosition: 0.5,
      });
    });
  };

  const handleDayPress = (day: number) => {
    const newDate = new Date(date.getFullYear(), date.getMonth(), day);
    setSelected(newDate);
    setDate(newDate);
    scrollToDay(day);
    setModalVisible(false);
  };

  const handlePrevMonth = () =>
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  const handleNextMonth = () =>
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));

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
                <Text className="text-lg font-semibold text-white dark:text-slate-950">
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
            <Text className="dark:text-white ml-8 text-3xl font-bold text-gray-800">
              DAY {date.getDate()}
            </Text>
            <Text className="dark:text-gray-400 text-xl ml-1 self-end mb-1">
              / {lastDate}
            </Text>
          </View>

          <FlatList
            ref={flatListRef}
            data={monthDays}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.toString()}
            contentContainerStyle={{ paddingHorizontal: 12, gap: 10 }}
            renderItem={({ item }) => {
              const isSelected =
                selected.getDate() === item &&
                selected.getMonth() === date.getMonth();
              return (
                <Pressable
                  onPress={() => handleDayPress(item)}
                  style={{ width: DAY_BOX_WIDTH, height: DAY_BOX_HEIGHT }}
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
                </Pressable>
              );
            }}
          />
        </View>

        {/* MODAL SECTION - FIX APPLIED HERE */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView
            className="flex-1 bg-white dark:bg-gray-950"
            edges={["top"]}
          >
            <View className="flex-1 px-4">
              {/* MODAL HEADER */}
              <View className="flex-row justify-between items-center border-b dark:border-gray-800 border-gray-200 py-4 mb-4">
                <Text className="dark:text-white text-xl font-bold">
                  Select Date
                </Text>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full"
                >
                  <Ionicons
                    name="close-outline"
                    size={24}
                    color={isDark ? "white" : "black"}
                  />
                </Pressable>
              </View>

              {/* MONTH NAVIGATION */}
              <View className="flex-row justify-between items-center mb-6">
                <Pressable
                  onPress={handlePrevMonth}
                  className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full"
                >
                  <Ionicons
                    name="chevron-back-outline"
                    size={20}
                    color={isDark ? "white" : "black"}
                  />
                </Pressable>
                <Text className="font-bold text-lg text-black dark:text-white">
                  {monthYear}
                </Text>
                <Pressable
                  onPress={handleNextMonth}
                  className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full"
                >
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color={isDark ? "white" : "black"}
                  />
                </Pressable>
              </View>

              {/* CALENDAR GRID */}
              <View className="flex-row mb-2">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                  <Text
                    key={d}
                    className="text-xs text-center font-bold text-gray-400"
                    style={{ width: `${100 / 7}%` }}
                  >
                    {d}
                  </Text>
                ))}
              </View>

              <View className="flex-row flex-wrap">
                {days.map((day, index) => {
                  const isSelected =
                    day &&
                    selected.getDate() === day &&
                    selected.getMonth() === date.getMonth();
                  return (
                    <View
                      key={index}
                      className="items-center my-2"
                      style={{ width: `${100 / 7}%` }}
                    >
                      {day ? (
                        <Animated.View
                          style={{
                            opacity: fadeAnim,
                            transform: [{ scale: fadeAnim }],
                          }}
                        >
                          <Pressable
                            onPress={() => handleDayPress(day)}
                            className={`h-12 w-12 rounded-full items-center justify-center ${
                              isSelected
                                ? "bg-gray-900 dark:bg-white"
                                : "bg-gray-100 dark:bg-gray-900"
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
                        </Animated.View>
                      ) : (
                        <View className="h-12 w-12" />
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </>
  );
}
