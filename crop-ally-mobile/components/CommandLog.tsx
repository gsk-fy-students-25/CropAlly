import { ScrollView, Text, View } from "react-native"

interface CommandEntry {
  text: string
  timestamp: Date
}

interface CommandLogProps {
  commands: CommandEntry[]
}

export default function CommandLog({ commands }: CommandLogProps) {
  return (
    <View className="bg-black/90 rounded border border-white/10 h-[150px]">
      <ScrollView className="p-3">
        {commands.length === 0 ? (
          <Text className="text-white/30 font-mono text-xs">No commands executed</Text>
        ) : (
          commands.map((cmd, index) => (
            <Text key={index} className="text-cyan-400 font-mono text-xs mb-1">
              <Text className="text-white/50">{`[${cmd.timestamp.toLocaleTimeString()}]`}</Text> {cmd.text}
            </Text>
          ))
        )}
      </ScrollView>
    </View>
  )
}
