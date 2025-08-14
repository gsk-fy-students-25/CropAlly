import { View } from "react-native"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"

export default function FuturisticTabBar() {
  return (
    <View className="h-full w-full">
      <LinearGradient colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]} className="absolute inset-0" />
      <BlurView intensity={30} tint="dark" className="h-full">
        <View className="absolute inset-0 border-t border-white/10" />

        <View className="absolute inset-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} className="w-full h-px bg-white/5" style={{ top: i * 10 }} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={i} className="h-full w-px bg-white/5" style={{ left: i * 20 }} />
          ))}
        </View>
      </BlurView>
    </View>
  )
}
