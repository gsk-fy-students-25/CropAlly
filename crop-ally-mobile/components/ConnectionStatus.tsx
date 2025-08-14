import React from 'react';
import { Text, View } from 'react-native';

interface ConnectionStatusProps {
  isConnected: boolean;
}


export default function ConnectionStatus({ isConnected } : ConnectionStatusProps) {
  return (
    <View
      className={`flex-row items-center px-3 py-1.5 rounded-full ${
        isConnected ? "bg-black/80 border border-cyan-500/30" : "bg-black/80 border border-white/10"
      }`}
    >
      <View className={`h-2 w-2 rounded-full mr-2 ${isConnected ? "bg-cyan-400" : "bg-white/30"}`} />
      <Text
        className={`text-xs font-medium ${isConnected ? "text-cyan-400" : "text-white/50"}`}
        style={{ fontFamily: "monospace" }}
      >
        {isConnected ? "ONLINE" : "OFFLINE"}
      </Text>
    </View>
  )
}
