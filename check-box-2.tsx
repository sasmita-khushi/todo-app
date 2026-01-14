import React from "react";
import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = {
  checked: boolean;
  onChange: (value: boolean) => void;
};

export default function CheckBox({ checked, onChange }: Props) {
  return (
    <Pressable onPress={() => onChange(!checked)}>
      <View
        style={{
          height: 24,
          width: 24,
          borderWidth: 2,
          [checked ? "borderColor" : "#4F46E5"]: "green",
          borderRadius: 4,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked && (
          <Ionicons
            name="checkmark-outline"
            size={20}
            color="white"
            style={{ backgroundColor: "green" }}
          />
        )}
      </View>
    </Pressable>
  );
}
