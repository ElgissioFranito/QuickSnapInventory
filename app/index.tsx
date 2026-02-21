import "@/global.css";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      className="bg-red-400"
    >
      {/* <Text className="text-3xl font-bold text-white animate-spin">I Love You</Text> */}

      <Text className="text-3xl font-bold text-white animate-bounce">I Love You</Text>
    </View>
  );
}
