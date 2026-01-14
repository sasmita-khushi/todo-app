import React from "react";
import { Pressable, View, useColorScheme } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = {
  checked: boolean;
  onChange: (value: boolean) => void;
};

export default function CheckBox({ checked, onChange }: Props) {
  const scheme = useColorScheme(); // "dark" | "light"

  const borderColor = scheme === "dark" ? "gray" : "#374151";
  const checkColor = scheme === "dark" ? "white" : "white";
  const fillColor = scheme === "dark" ? "green" : "green";

  return (
    <Pressable onPress={() => onChange(!checked)}>
      <View
        style={{
          height: 24,
          width: 24,
          borderWidth: 2,
          borderColor: checked ? fillColor : borderColor,
          borderRadius: 4,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: checked ? fillColor : "transparent",
        }}
      >
        {checked && (
          <Ionicons name="checkmark-outline" size={20} color={checkColor} />
        )}
      </View>
    </Pressable>
  );
}
