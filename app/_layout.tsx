import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../context/theme-context";
import "../global.css";

function LayoutStack() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDark ? "#030712" : "#FFFFFF" }}
      edges={["bottom"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: isDark ? "#030712" : "#FFFFFF",
          },
          headerTintColor: isDark ? "#fff" : "#000",
        }}
      ></Stack>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LayoutStack />
    </ThemeProvider>
  );
}
