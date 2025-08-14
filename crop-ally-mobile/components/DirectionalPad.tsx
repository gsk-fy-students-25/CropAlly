import { Feather } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import * as Haptics from "expo-haptics"
import { useCallback, useRef, useState } from "react"
import { Pressable, Text, View } from "react-native"

interface DirectionalPadProps {
  onMove: (x: number, y: number) => void;
  videoMode?: boolean;
}

export default function DirectionalPad({ onMove, videoMode = false }: DirectionalPadProps) {
  const [activeDirection, setActiveDirection] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const dpadSize = videoMode ? 160 : 144
  const buttonSize = videoMode ? 48 : 44
  
  const startMovement = useCallback((x: number, y: number, direction: string) => {
    setActiveDirection(direction)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    
    // Send initial command
    onMove(x, y)
    
    // Continue sending commands while pressed
    intervalRef.current = setInterval(() => {
      onMove(x, y)
    }, 100) // Send every 100ms for consistent control
  }, [onMove])

  const stopMovement = useCallback(() => {
    setActiveDirection(null)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    onMove(0, 0) // Stop movement
  }, [onMove])

  const getButtonStyle = (direction: string, isActive: boolean) => ({
    backgroundColor: isActive 
      ? (videoMode ? 'rgba(0, 255, 255, 0.8)' : 'rgba(0, 255, 0, 0.8)')
      : 'rgba(0, 0, 0, 0.6)',
    borderColor: videoMode ? 'rgba(0, 255, 255, 0.4)' : 'rgba(0, 255, 0, 0.4)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  })

  return (
    <View style={{
      position: 'absolute',
      bottom: videoMode ? 28 : 32,
      right: 12,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <BlurView 
        intensity={25} 
        tint="dark" 
        style={{
          width: dpadSize,
          height: dpadSize,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: videoMode ? 'rgba(0, 255, 255, 0.2)' : 'rgba(0, 255, 0, 0.2)',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}
      >
        <View style={{
          width: dpadSize - 20,
          height: dpadSize - 20,
          position: 'relative'
        }}>
          {/* Up Button */}
          <Pressable
            style={[
              {
                position: 'absolute',
                top: 0,
                left: (dpadSize - 40 - buttonSize) / 2,
                width: buttonSize,
                height: buttonSize,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center'
              },
              getButtonStyle('up', activeDirection === 'up')
            ]}
            onPressIn={() => startMovement(0, -1, 'up')} // Forward
            onPressOut={stopMovement}
          >
            <Feather 
              name="chevron-up" 
              size={24} 
              color={activeDirection === 'up' ? 'white' : (videoMode ? '#22d3ee' : '#22d3ee')} 
            />
          </Pressable>

          {/* Down Button */}
          <Pressable
            style={[
              {
                position: 'absolute',
                bottom: 0,
                left: (dpadSize - 40 - buttonSize) / 2,
                width: buttonSize,
                height: buttonSize,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center'
              },
              getButtonStyle('down', activeDirection === 'down')
            ]}
            onPressIn={() => startMovement(0, 1, 'down')} // Backward
            onPressOut={stopMovement}
          >
            <Feather 
              name="chevron-down" 
              size={24} 
              color={activeDirection === 'down' ? 'white' : (videoMode ? '#22d3ee' : '#22d3ee')} 
            />
          </Pressable>

          {/* Left Button */}
          <Pressable
            style={[
              {
                position: 'absolute',
                left: 0,
                top: (dpadSize - 40 - buttonSize) / 2,
                width: buttonSize,
                height: buttonSize,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center'
              },
              getButtonStyle('left', activeDirection === 'left')
            ]}
            onPressIn={() => startMovement(-1, 0, 'left')} // Turn left
            onPressOut={stopMovement}
          >
            <Feather 
              name="chevron-left" 
              size={24} 
              color={activeDirection === 'left' ? 'white' : (videoMode ? '#22d3ee' : '#22d3ee')} 
            />
          </Pressable>

          {/* Right Button */}
          <Pressable
            style={[
              {
                position: 'absolute',
                right: 0,
                top: (dpadSize - 40 - buttonSize) / 2,
                width: buttonSize,
                height: buttonSize,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center'
              },
              getButtonStyle('right', activeDirection === 'right')
            ]}
            onPressIn={() => startMovement(1, 0, 'right')} // Turn right
            onPressOut={stopMovement}
          >
            <Feather 
              name="chevron-right" 
              size={24} 
              color={activeDirection === 'right' ? 'white' : (videoMode ? '#22d3ee' : '#22d3ee')} 
            />
          </Pressable>

          {/* Center indicator */}
          <View style={{
            position: 'absolute',
            top: (dpadSize - 40 - 16) / 2,
            left: (dpadSize - 40 - 16) / 2,
            width: 16,
            height: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: videoMode ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 255, 0, 0.3)',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <View style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: videoMode ? 'rgba(0, 255, 255, 0.6)' : 'rgba(0, 255, 0, 0.6)'
            }} />
          </View>
        </View>

        <Text style={{
          position: 'absolute',
          bottom: 8,
          fontSize: 10,
          fontFamily: 'monospace',
          color: videoMode ? 'rgba(0, 255, 255, 0.8)' : 'rgba(0, 255, 0, 0.8)'
        }}>
          DIRECTIONAL CONTROL
        </Text>
      </BlurView>
    </View>
  )
}
