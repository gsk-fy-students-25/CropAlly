import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { Text, TouchableOpacity, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface StatusBarProps {
  isConnected: boolean
  autonomousMode: boolean
  batteryLevel: number
  batteryStyle: any
  toggleDetailPanel: () => void
  colors: {
    primary: string
    danger: string
  }
}

export function StatusBar({ 
  isConnected, 
  autonomousMode, 
  batteryLevel, 
  batteryStyle,
  toggleDetailPanel,
  colors
}: StatusBarProps) {
  const insets = useSafeAreaInsets()
  
  return (
    <Animated.View 
      entering={FadeIn.delay(300).duration(500)}
      className="absolute top-0 left-0 right-0 z-10"
      style={{ paddingTop: insets.top }}
    >
      <BlurView intensity={30} tint="dark" className="px-4 pt-1 pb-2">
        <View className="flex-row justify-between items-center">
          {/* Left group - connection status */}
          <View className="flex-row items-center">
            <View className="flex-row items-center bg-black/30 rounded-full px-3 py-1">
              <View className={`h-2 w-2 rounded-full mr-2 ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
              <Text className="text-white font-mono text-xs">
                {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </Text>
            </View>
            
            <View className="flex-row items-center ml-3 bg-black/30 rounded-full px-3 py-1">
              <Text className="text-white/80 font-mono text-xs mr-1">MODE:</Text>
              <Text className={`font-mono text-xs ${autonomousMode ? "text-amber-400" : "text-cyan-400"}`}>
                {autonomousMode ? "AUTONOMOUS" : "MANUAL"}
              </Text>
            </View>
          </View>
          
          {/* Right group - system status */}
          <View className="flex-row items-center space-x-3">
            {/* Battery indicator with animation for low battery */}
            <Animated.View style={batteryStyle} className="flex-row items-center bg-black/30 rounded-full px-3 py-1">
              <MaterialCommunityIcons 
                name={batteryLevel > 50 ? "battery-70" : batteryLevel > 20 ? "battery-30" : "battery-alert"}
                size={16} 
                color={batteryLevel > 30 ? colors.primary : colors.danger} 
              />
              <Text className={`text-xs ml-1 font-mono ${
                batteryLevel > 30 ? "text-green-400" : "text-red-400"
              }`}>{batteryLevel}%</Text>
            </Animated.View>
            
            {/* Signal strength */}
            <View className="flex-row items-center bg-black/30 rounded-full px-3 py-1">
              <Feather name="wifi" size={14} color="#ffffff" />
              <Text className="text-white text-xs ml-1 font-mono">-67dBm</Text>
            </View>
            
            {/* Latency */}
            <View className="flex-row items-center bg-black/30 rounded-full px-3 py-1">
              <Feather name="clock" size={14} color="#ffffff" />
              <Text className="text-white text-xs ml-1 font-mono">24ms</Text>
            </View>
            
            {/* Settings button */}
            <TouchableOpacity 
              onPress={toggleDetailPanel}
              className="flex-row items-center bg-black/30 rounded-full px-3 py-1"
            >
              <Feather name="more-vertical" size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  )
}