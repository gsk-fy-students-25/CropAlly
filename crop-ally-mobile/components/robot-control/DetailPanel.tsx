import { Feather } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { Text, TouchableOpacity, View } from "react-native"
import Animated from "react-native-reanimated"

interface DetailPanelProps {
  style: {
    transform: { translateX: number }[]
    opacity: number
  }
  isVisible: boolean
  toggleDetailPanel: () => void
  batteryLevel: number
  connectionType: string
}

export function DetailPanel({ style, toggleDetailPanel, batteryLevel, connectionType }: DetailPanelProps) {
  return (
    <Animated.View 
      style={style}
      className="absolute top-16 bottom-20 right-0 w-[300px] z-20"
    >
      <BlurView intensity={40} tint="dark" className="flex-1 rounded-l-2xl p-4 border-l border-t border-b border-white/10">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white font-bold font-mono">SYSTEM DETAILS</Text>
          <TouchableOpacity onPress={toggleDetailPanel}>
            <Feather name="x" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
        
        <View className="space-y-5">
          <View>
            <Text className="text-white/60 font-mono text-xs mb-1">ROBOT STATS</Text>
            <View className="bg-black/20 rounded-lg p-3 space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-white/70 font-mono text-xs">Battery</Text>
                <Text className="text-white font-mono text-xs">{batteryLevel}%</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white/70 font-mono text-xs">Motor Temp</Text>
                <Text className="text-white font-mono text-xs">52°C</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white/70 font-mono text-xs">CPU Load</Text>
                <Text className="text-white font-mono text-xs">24%</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white/70 font-mono text-xs">Uptime</Text>
                <Text className="text-white font-mono text-xs">4h 23m</Text>
              </View>
            </View>
          </View>
          
          <View>
            <Text className="text-white/60 font-mono text-xs mb-1">CONNECTION</Text>
            <View className="bg-black/20 rounded-lg p-3 space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-white/70 font-mono text-xs">IP Address</Text>
                <Text className="text-white font-mono text-xs">192.168.1.105</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white/70 font-mono text-xs">Protocol</Text>
                <Text className="text-white font-mono text-xs">{connectionType.toUpperCase()}</Text>
              </View>
            </View>
          </View>
          
          <View>
            <Text className="text-white/60 font-mono text-xs mb-1">MISSION STATUS</Text>
            <View className="bg-black/20 rounded-lg p-3 space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-white/70 font-mono text-xs">Area Covered</Text>
                <Text className="text-white font-mono text-xs">1.2 hectares</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white/70 font-mono text-xs">Est. Completion</Text>
                <Text className="text-white font-mono text-xs">2h 15m</Text>
              </View>
            </View>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  )
}