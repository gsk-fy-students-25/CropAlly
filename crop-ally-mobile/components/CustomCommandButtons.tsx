import { View, TouchableOpacity, Text } from "react-native"
import { Feather } from "@expo/vector-icons"

interface CustomCommandButtonsProps {
  onPress: (command: string) => void
}

type FeatherIconName = React.ComponentProps<typeof Feather>["name"]

interface Command {
  name: string
  icon: FeatherIconName
  color: string
}

export default function CustomCommandButtons({ onPress }: CustomCommandButtonsProps) {
  const commands: Command[] = [
    { name: "STOP", icon: "square", color: "#f87171" },
    { name: "HOME", icon: "home", color: "#22d3ee" },
    { name: "RESET", icon: "refresh-cw", color: "#22d3ee" },
    { name: "SCAN", icon: "search", color: "#22d3ee" },
  ]

  return (
    <View className="flex-row flex-wrap justify-between">
      {commands.map((cmd) => (
        <TouchableOpacity
          key={cmd.name}
          className={`w-[48%] mb-3 p-4 rounded-md border ${
            cmd.name === "STOP" ? "border-red-500/30 bg-black/90" : "border-cyan-500/30 bg-black/90"
          } items-center justify-center`}
          onPress={() => onPress(cmd.name)}
        >
          <Feather name={cmd.icon} size={20} color={cmd.color} className="mb-2" />
          <Text
            className={`${cmd.name === "STOP" ? "text-red-400" : "text-cyan-400"} font-medium`}
            style={{ fontFamily: "monospace" }}
          >
            {cmd.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}
