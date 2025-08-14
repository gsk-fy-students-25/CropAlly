import { Feather } from "@expo/vector-icons"
import { Text, TouchableOpacity, View } from "react-native"
import Animated from "react-native-reanimated"

interface EmergencyStopButtonProps {
  onPress: () => void
  style: any
}

export function EmergencyStopButton({ onPress, style }: EmergencyStopButtonProps) {
  return (
    <Animated.View style={style}>
      <TouchableOpacity 
        onPress={onPress}
        className="bg-red-500/90 w-24 h-24 rounded-2xl items-center justify-center border-2 border-red-500"
      >
        <View className="absolute inset-0 bg-red-500/20 rounded-2xl" />
        <Feather name="square" size={32} color="white" />
        <Text className="text-white font-bold mt-1 font-mono">STOP</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}