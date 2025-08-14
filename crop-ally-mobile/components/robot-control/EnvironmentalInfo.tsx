import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { Text, View } from "react-native"
import Animated, { FadeIn, SlideInRight, SlideOutRight } from "react-native-reanimated"

interface EnvironmentalInfoProps {
  autonomousMode: boolean
  warningColor: string
}

export function EnvironmentalInfo({ autonomousMode, warningColor }: EnvironmentalInfoProps) {
  return (
    <>
      <Animated.View 
        entering={FadeIn.delay(500).duration(500)}
        className="absolute top-20 left-5 items-start"
      >
        <BlurView intensity={20} tint="dark" className="px-4 py-3 rounded-xl">
          <View className="flex-row items-center">
            <Text className="text-3xl font-bold text-white" style={{ fontFamily: "monospace" }}>
              FIELD<Text className="text-green-400">_SCAN</Text>
            </Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Text className="text-white/70 text-sm font-mono">
              ROW 12 • SECTION B
            </Text>
          </View>
          
          {/* Environmental data */}
          <View className="mt-3 flex-row space-x-3">
            <View className="items-center">
              <Text className="text-xs text-white/50 font-mono">TEMPERATURE</Text>
              <Text className="text-white font-mono text-lg">24°C</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-xs text-white/50 font-mono">HUMIDITY</Text>
              <Text className="text-white font-mono text-lg">68%</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-xs text-white/50 font-mono">LIGHT</Text>
              <Text className="text-white font-mono text-lg">14K lux</Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>
      
      {/* Status badges that appear when important events happen */}
      {autonomousMode && (
        <Animated.View 
          entering={SlideInRight}
          exiting={SlideOutRight}
          className="absolute top-28 right-5"
        >
          <BlurView intensity={30} tint="dark" className="px-3 py-2 rounded-lg border border-amber-500/30">
            <View className="flex-row items-center">
              <Ionicons name="analytics" size={16} color={warningColor} />
              <Text className="text-amber-400 text-sm font-mono ml-2">AUTONOMOUS MODE ACTIVE</Text>
            </View>
          </BlurView>
        </Animated.View>
      )}
    </>
  )
}