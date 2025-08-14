import { View, Text } from "react-native"

interface TelemetryData {
  battery?: number
  temperature?: number
  speed?: number
  status?: string
  position?: {
    x: number
    y: number
  }
}

interface TelemetryDisplayProps {
  data: TelemetryData
}

export default function TelemetryDisplay({ data }: TelemetryDisplayProps) {
  const getBatteryColor = (level: number) => {
    if (level > 70) return "text-cyan-400"
    if (level > 30) return "text-yellow-400"
    return "text-red-400"
  }

  const getTemperatureColor = (temp: number) => {
    if (temp < 50) return "text-cyan-400"
    if (temp < 80) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <View className="space-y-3">
      <MetricItem
        label="BATTERY"
        value={`${data?.battery?.toFixed(1) || "0.0"}%`}
        icon="battery"
        valueColor={getBatteryColor(data?.battery || 0)}
      />

      <MetricItem
        label="TEMPERATURE"
        value={`${data?.temperature?.toFixed(1) || "0.0"}°C`}
        icon="thermometer"
        valueColor={getTemperatureColor(data?.temperature || 0)}
      />

      <MetricItem
        label="VELOCITY"
        value={`${data?.speed?.toFixed(2) || "0.00"} m/s`}
        icon="trending-up"
        valueColor="text-cyan-400"
      />

      <MetricItem label="STATUS" value={data?.status || "UNKNOWN"} icon="activity" valueColor="text-cyan-400" />
    </View>
  )
}

interface MetricItemProps {
  label: string;
  value: string;
  icon: string;
  valueColor?: string;
}

function MetricItem({ label, value, icon, valueColor = "text-white" }: MetricItemProps) {
  return (
    <View className="bg-black/90 p-3 rounded-md border border-white/5">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="w-6 h-6 items-center justify-center">
            <Text className="text-white/50 font-mono text-xs">{icon}</Text>
          </View>
          <Text className="text-white/50 font-mono ml-2">{label}</Text>
        </View>
        <Text className={`${valueColor} font-medium font-mono`}>{value}</Text>
      </View>
    </View>
  )
}
