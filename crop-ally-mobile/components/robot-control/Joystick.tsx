import { Feather } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { Text, View } from "react-native"
import { PanGestureHandler } from "react-native-gesture-handler"
import Animated, { 
  useAnimatedGestureHandler, 
  useAnimatedStyle, 
  useSharedValue,
  withSpring,
  runOnJS
} from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect } from "react"

interface JoystickProps {
  onMove: (x: number, y: number) => void;
  videoMode?: boolean;
}

export function Joystick({ onMove, videoMode = true }: JoystickProps) {
  const posX = useSharedValue(0)
  const posY = useSharedValue(0)
  const isActive = useSharedValue(false)

  const joystickSize = videoMode ? 160 : 144
  const knobSize = videoMode ? 40 : 36
  const maxDistance = (joystickSize - knobSize) / 2

  const joystickStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: posX.value },
      { translateY: posY.value }
    ],
    backgroundColor: isActive.value 
      ? videoMode ? 'rgba(0, 255, 255, 0.8)' : 'rgba(0, 255, 0, 0.8)'
      : videoMode ? 'rgba(0, 255, 255, 0.6)' : 'rgba(0, 255, 0, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  }))

  const handleGesture = useAnimatedGestureHandler({
    onStart: () => {
      isActive.value = true
    },
    onActive: (event) => {
      // Calculate distance from center
      const distance = Math.sqrt(event.translationX ** 2 + event.translationY ** 2)
      
      // Limit to joystick bounds
      if (distance > maxDistance) {
        const angle = Math.atan2(event.translationY, event.translationX)
        posX.value = maxDistance * Math.cos(angle)
        posY.value = maxDistance * Math.sin(angle)
      } else {
        posX.value = event.translationX
        posY.value = event.translationY
      }

      // Normalize values between -1 and 1
      const normalizedX = posX.value / maxDistance
      const normalizedY = posY.value / maxDistance
      
      // Use runOnJS to call the callback on the JavaScript thread
      runOnJS(onMove)(normalizedX, normalizedY)
    },
    onEnd: () => {
      // Smoothly return to center
      posX.value = withSpring(0)
      posY.value = withSpring(0)
      isActive.value = false
      runOnJS(onMove)(0, 0)
    },
    onFail: () => {
      posX.value = withSpring(0)
      posY.value = withSpring(0)
      isActive.value = false
      runOnJS(onMove)(0, 0)
    }
  })

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      posX.value = 0
      posY.value = 0
    }
  }, [])

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
          width: joystickSize,
          height: joystickSize,
          borderRadius: joystickSize / 2,
          borderWidth: 1,
          borderColor: videoMode ? 'rgba(0, 255, 255, 0.2)' : 'rgba(0, 255, 0, 0.2)',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <View style={{
          flex: 1,
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}>
          <PanGestureHandler 
            onGestureEvent={handleGesture}
            activeOffsetX={[-5, 5]} // Active range in X (replaces minDist)
            activeOffsetY={[-5, 5]} // Active range in Y (replaces minDist)
          >
            <Animated.View style={[{
              width: knobSize,
              height: knobSize,
              borderRadius: knobSize / 2,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute'
            }, joystickStyle]}>
              <LinearGradient
                colors={videoMode 
                  ? ['rgba(0, 255, 255, 1)', 'rgba(0, 255, 255, 0.7)'] 
                  : ['rgba(0, 255, 0, 1)', 'rgba(0, 255, 0, 0.7)']}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: knobSize / 2,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Feather name="move" size={videoMode ? 24 : 20} color="white" />
              </LinearGradient>
            </Animated.View>
          </PanGestureHandler>
        </View>

        {/* Direction indicators */}
        <Feather 
          name="chevron-up"
          size={18} 
          color="rgba(255,255,255,0.5)" 
          style={{ position: 'absolute', top: 8 }}
        />
        <Feather 
          name="chevron-down"
          size={18} 
          color="rgba(255,255,255,0.5)" 
          style={{ position: 'absolute', bottom: 8 }}
        />
        <Feather 
          name="chevron-left"
          size={18} 
          color="rgba(255,255,255,0.5)" 
          style={{ position: 'absolute', left: 8 }}
        />
        <Feather 
          name="chevron-right"
          size={18} 
          color="rgba(255,255,255,0.5)" 
          style={{ position: 'absolute', right: 8 }}
        />
        
        <Text style={{
          position: 'absolute',
          bottom: 16,
          fontSize: 12,
          fontFamily: 'monospace',
          color: videoMode ? 'rgba(0, 255, 255, 0.8)' : 'rgba(0, 255, 0, 0.8)'
        }}>
          MOVEMENT CONTROL
        </Text>
      </BlurView>
    </View>
  )
}