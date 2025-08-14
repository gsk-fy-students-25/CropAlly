import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import React from "react"
import { View, Text, TouchableOpacity, Pressable } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"

interface RemoteControlsProps {
  currentTool: string;
  setCurrentTool: (tool: string) => void;
  precision: number;
  setPrecision: (value: number) => void;
}

export function RemoteControls({ 
  currentTool, 
  setCurrentTool,
  precision,
  setPrecision
}: RemoteControlsProps) {
  const tools = [
    { id: 'move', icon: 'move', label: 'MOVE' },
    { id: 'arm', icon: 'link', label: 'ARM' },
    { id: 'drill', icon: 'tool', label: 'DRILL' },
    { id: 'scan', icon: 'search', label: 'SCAN' }
  ];
  
  return (
    <Animated.View 
      entering={FadeIn}
      className="absolute left-5 top-1/2 -translate-y-1/2"
    >
      <BlurView intensity={25} tint="dark" className="p-3 rounded-2xl border border-white/10">
        {/* Tool Selector */}
        <View className="mb-4">
          <Text className="text-white/70 font-mono text-xs mb-2 text-center">TOOL SELECT</Text>
          <View className="flex-row space-x-2">
            {tools.map(tool => (
              <TouchableOpacity
                key={tool.id}
                onPress={() => setCurrentTool(tool.id)}
                className={`w-14 h-14 items-center justify-center rounded-lg ${
                  currentTool === tool.id 
                    ? "bg-green-500/20 border border-green-500/50" 
                    : "bg-black/20 border border-white/10"
                }`}
              >
                <Feather 
                  name={tool.icon as any} 
                  size={18} 
                  color={currentTool === tool.id ? "#4ade80" : "#ffffff"} 
                />
                <Text className={`font-mono text-[10px] mt-1 ${
                  currentTool === tool.id ? "text-green-400" : "text-white/70"
                }`}>
                  {tool.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Precision Controls */}
        <View className="mb-4">
          <Text className="text-white/70 font-mono text-xs mb-2 text-center">PRECISION</Text>
          <View className="flex-row justify-center space-x-1">
            {[1, 2, 3].map(level => (
              <TouchableOpacity
                key={level}
                onPress={() => setPrecision(level)}
                className={`w-8 h-8 items-center justify-center rounded-md ${
                  precision === level 
                    ? "bg-cyan-500/20 border border-cyan-500/50" 
                    : "bg-black/20 border border-white/10"
                }`}
              >
                <Text className={precision === level ? "text-cyan-400" : "text-white/70"}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* D-Pad Controls */}
        <View>
          <Text className="text-white/70 font-mono text-xs mb-2 text-center">D-PAD</Text>
          <View className="h-32 w-32 relative">
            {/* Up button */}
            <Pressable 
              className="absolute top-0 left-1/4 w-1/2 h-1/4 bg-slate-800/80 rounded-t-lg border border-white/10 items-center justify-center"
            >
              <Feather name="chevron-up" size={18} color="#ffffff" />
            </Pressable>
            
            {/* Right button */}
            <Pressable 
              className="absolute top-1/4 right-0 w-1/4 h-1/2 bg-slate-800/80 rounded-r-lg border border-white/10 items-center justify-center"
            >
              <Feather name="chevron-right" size={18} color="#ffffff" />
            </Pressable>
            
            {/* Down button */}
            <Pressable 
              className="absolute bottom-0 left-1/4 w-1/2 h-1/4 bg-slate-800/80 rounded-b-lg border border-white/10 items-center justify-center"
            >
              <Feather name="chevron-down" size={18} color="#ffffff" />
            </Pressable>
            
            {/* Left button */}
            <Pressable 
              className="absolute top-1/4 left-0 w-1/4 h-1/2 bg-slate-800/80 rounded-l-lg border border-white/10 items-center justify-center"
            >
              <Feather name="chevron-left" size={18} color="#ffffff" />
            </Pressable>
            
            {/* Center */}
            <View className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-slate-700/80 rounded-md border border-white/10 items-center justify-center">
              <Feather name="plus" size={16} color="#ffffff80" />
            </View>
          </View>
        </View>
        
        {/* Presets */}
        <View className="mt-4">
          <Text className="text-white/70 font-mono text-xs mb-2 text-center">PRESETS</Text>
          <View className="flex-row space-x-2">
            <TouchableOpacity className="flex-1 h-10 bg-slate-800/80 rounded-lg border border-white/10 items-center justify-center">
              <Text className="text-white/70 font-mono text-xs">HOME</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 h-10 bg-slate-800/80 rounded-lg border border-white/10 items-center justify-center">
              <Text className="text-white/70 font-mono text-xs">DOCK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  )
}