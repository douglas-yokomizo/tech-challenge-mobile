import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Bookmarks() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-2">
        <Text className="text-2xl font-bold">Bookmarks</Text>
      </View>
    </SafeAreaView>
  );
}
