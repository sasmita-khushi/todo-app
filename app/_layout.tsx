import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../context/theme-context";
import "../global.css";
import { useFonts } from "expo-font";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

function LayoutStack() {
  const { isDark } = useTheme();

  const [fontsLoaded] = useFonts({
    Roboto: Roboto_400Regular,
    RobotoMedium: Roboto_500Medium,
    RobotoBold: Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDark ? "#030712" : "#FFFFFF",
        }}
      >
        <StatusBar style={isDark ? "light" : "dark"} />
        <Text style={{ fontFamily: "Roboto" }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // ✅ RETURN UI WHEN FONTS ARE LOADED
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
      />
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
