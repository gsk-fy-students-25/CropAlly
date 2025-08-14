"use client"

import { useState } from "react"
import { View, PanResponder, Animated, StyleSheet, TouchableOpacity } from "react-native"

interface JoystickProps {
  onMove: (command: string) => void
  isConnected: boolean
}

// Define types for style properties
interface StyleProps {
  backgroundColor: string
  borderWidth: number
  borderColor: string
  borderRadius: number
  width: number
  height: number
  justifyContent?: string
  alignItems?: string
  opacity?: number
}

export default function Joystick({ onMove, isConnected }: JoystickProps) {
  const [pan] = useState(new Animated.ValueXY())
  const [lastCommand, setLastCommand] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  const JOYSTICK_SIZE = 100
  const HANDLE_SIZE = 40
  const MAX_DISTANCE = (JOYSTICK_SIZE - HANDLE_SIZE) / 2

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (!isConnected) return; // Don't send commands if not connected

      let dx = gestureState.dx
      let dy = gestureState.dy

      // Calculate distance from center
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Limit movement to the joystick bounds
      if (distance > MAX_DISTANCE) {
        const angle = Math.atan2(dy, dx)
        dx = MAX_DISTANCE * Math.cos(angle)
        dy = MAX_DISTANCE * Math.sin(angle)
      }

      // Update position
      pan.setValue({ x: dx, y: dy })

      // Determine command based on position
      let command = ""
      const threshold = MAX_DISTANCE * 0.5

      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal movement is dominant
        if (dx > threshold) command = "RIGHT"
        else if (dx < -threshold) command = "LEFT"
      } else {
        // Vertical movement is dominant
        if (dy > threshold) command = "BACKWARD"
        else if (dy < -threshold) command = "FORWARD"
      }

      // Only send command if it changed
      if (command !== lastCommand) {
        onMove(command)
        setLastCommand(command)
      }
    },
    onPanResponderRelease: () => {
      pan.setValue({ x: 0, y: 0 })
      onMove("")
      setLastCommand("")
    },
  })

  const styles = StyleSheet.create({
    container: {
      width: JOYSTICK_SIZE,
      height: JOYSTICK_SIZE,
      borderRadius: JOYSTICK_SIZE / 2,
      backgroundColor: "#f5f5f5",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#ccc"
    },
    handle: {
      width: HANDLE_SIZE,
      height: HANDLE_SIZE,
      borderRadius: HANDLE_SIZE / 2,
      backgroundColor: "#2dd36f",
      borderWidth: 2,
      borderColor: "#fff"
    },
    disabled: {
      opacity: 0.5
    }
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={[
          styles.container,
          !isConnected && styles.disabled
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={() => setIsDragging(true)}
          onPressOut={() => setIsDragging(false)}
        >
          <Animated.View
            {...panResponder.panHandlers}
            style={[styles.handle, pan.getLayout()]}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}
