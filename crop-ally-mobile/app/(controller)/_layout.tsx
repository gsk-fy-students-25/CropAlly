import { Stack } from "expo-router"
import { useColorScheme } from "react-native"
import * as ScreenOrientation from 'expo-screen-orientation'
import { useEffect } from "react"

export default function AppLayout() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  
  // Lock to portrait by default for all screens except Control
  useEffect(() => {
    async function lockToPortrait() {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      )
    }
    
    lockToPortrait()
    
    return () => {
    }
  }, [])
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDark ? "#000000" : "#ffffff",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="control"
        options={{
          animation: "slide_from_right",
          gestureEnabled: false, // Disable swipe back since it's a protected route
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          animation: "slide_from_bottom",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          animation: "slide_from_bottom",
          presentation: "modal",
        }}
      />
    </Stack>
  )
}