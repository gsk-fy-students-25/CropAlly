import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs"
import * as Haptics from "expo-haptics"
import { GestureResponderEvent, Platform, Pressable } from "react-native"

export function HapticTab(props: BottomTabBarButtonProps) {
  const { onPress, ...rest } = props
  
  return (
    <Pressable
      {...rest}
      onPress={(e: GestureResponderEvent) => {
        if (Platform.OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
        // Pass through the event to the original onPress handler
        onPress?.(e)
      }}
    />
  )
}

