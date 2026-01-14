import { View } from "react-native";
import Calender from "@/components/calender";
export default function Foo() {
  return (
    <View>
      <Calender year={2028} month={6} />
      {/* <Calender year={2026} month={0} /> */}
    </View>
  );
}
