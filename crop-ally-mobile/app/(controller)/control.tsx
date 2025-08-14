import DirectionalPad from "@/components/DirectionalPad"
import { BackgroundView } from "@/components/robot-control/BackgroundView"
import { ControlPanel } from "@/components/robot-control/ControlPanel"
import { DetailPanel } from "@/components/robot-control/DetailPanel"
import { EnvironmentalInfo } from "@/components/robot-control/EnvironmentalInfo"
import { TopNavigation } from "@/components/robot-control/TopNavigation"
import { WebSocketAnimatedWrapperRef } from "@/components/WebSocketAnimatedWrapper"
import { TypedWebSocketMessage } from "@/constants/socket"
import { useConnection } from "@/context/ConnectionContext"
import * as Haptics from 'expo-haptics'
import { router } from "expo-router"
import * as ScreenOrientation from 'expo-screen-orientation'
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Alert, Dimensions, StyleSheet, useColorScheme, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"

const { width, height } = Dimensions.get("window")

export default function ControlScreen() {
  const { isConnected, serverAddress, connectionType, connect, disconnect, sendWebSocketMessage } = useConnection()

  // Remove demo mode - ensure we're connected or redirect
  useEffect(() => {
    // If connection is lost, redirect to welcome screen
    if (!isConnected) {
      router.replace("/")
    }
  }, [isConnected])
  
  const [isRecording, setIsRecording] = useState(false)
  const [showDetailPanel, setShowDetailPanel] = useState(false)
  const [autonomousMode, setAutonomousMode] = useState(false)
  const [videoMode, setVideoMode] = useState(false) // Default to control mode
  const [precision] = useState(2)
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  // Movement tracking refs with debouncing
  const lastSent = useRef({ x: 0, y: 0 })
  const lastUpdate = useRef(0)
  const MOVEMENT_THRESHOLD = 0.05
  const DEADZONE = 0.1
  const UPDATE_INTERVAL = 50 // ms

  // Colors with memoization
  const COLORS = useMemo(() => ({
    primary: "#2dd36f",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#22d3ee",
    background: isDark ? "#0f172a" : "#f8fafc",
    backgroundGradient: isDark 
      ? ['rgba(15, 23, 42, 1)', 'rgba(20, 30, 50, 0.95)'] 
      : ['rgba(248, 250, 252, 1)', 'rgba(241, 245, 249, 0.95)'],
    cardBackground: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    textPrimary: isDark ? "#ffffff" : "#1a1a1a",
    textSecondary: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
    overlay: "rgba(0,0,0,0.5)"
  }), [isDark])

  // Screen orientation
  useEffect(() => {
    const setLandscape = async () => {
      try {
        await ScreenOrientation.unlockAsync();
        // Only lock to landscape if device supports it
        const orientationInfo = await ScreenOrientation.getOrientationAsync();
        console.log('Current orientation:', orientationInfo);
        
        // Try to set landscape, but don't fail if not supported
        try {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        } catch (orientationError) {
          console.log('Landscape orientation not supported, continuing...');
        }
      } catch (error) {
        console.error('Error setting orientation:', error);
      }
    };

    setLandscape();

    return () => {
      // Clean up command interval on unmount
      if (commandInterval.current) {
        clearInterval(commandInterval.current);
        commandInterval.current = null;
      }
      // Only unlock if we can
      ScreenOrientation.unlockAsync()
        .catch(error => console.log('Error unlocking orientation:', error));
    };
  }, []);

  const navigateToWelcome = useCallback(() => router.replace("/"), [])

  const handleDisconnect = useCallback(() => {
    Alert.alert(
      "Disconnect from Robot",
      "Are you sure you want to disconnect from the robot?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect", 
          style: "destructive", 
          onPress: async () => {
            try {
              await disconnect()
              navigateToWelcome()
            } catch (error) {
              console.error("Disconnection error:", error)
              Alert.alert("Error", "Failed to disconnect properly")
            }
          }
        }
      ]
    )
  }, [disconnect, navigateToWelcome])

  // Animation values
  const detailPanelPosition = useSharedValue(0)
  const stopButtonScale = useSharedValue(1)
  const batteryPulse = useSharedValue(0)
  const batteryLevel = 70 // Example value

  useEffect(() => {
    if (batteryLevel < 30) {
      batteryPulse.value = withTiming(1, { duration: 1000 }, () => {
        batteryPulse.value = withTiming(0, { duration: 1000 })
      })
    }
  }, [batteryLevel])

  const stopButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: stopButtonScale.value }]
  }))

  const batteryStyle = useAnimatedStyle(() => ({
    opacity: interpolate(batteryPulse.value, [0, 0.5, 1], [1, 0.6, 1], Extrapolate.CLAMP)
  }))

  const detailPanelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(detailPanelPosition.value, [0, 1], [300, 0]) }],
    opacity: interpolate(detailPanelPosition.value, [0, 1], [0, 1])
  }))

  // Control functions with useCallback
  const emergencyStop = useCallback(() => {
    stopButtonScale.value = withSpring(1.2, {}, () => {
      stopButtonScale.value = withSpring(1)
    })
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    
    if (isConnected) {
      try {
        // Send emergency stop command with new format
        const command = {
          speed: 0,
          turn: 0,
          hold: false
        }
        sendWebSocketMessage(command)
        console.log("🛑 Emergency stop sent to server")
      } catch (error) {
        console.error("Emergency stop failed:", error)
      }
    }
  }, [isConnected, sendWebSocketMessage])

  const toggleDetailPanel = useCallback(() => {
    setShowDetailPanel(prev => {
      detailPanelPosition.value = withSpring(prev ? 0 : 1)
      return !prev
    })
    Haptics.selectionAsync()
  }, [])

  const toggleAutonomousMode = useCallback(() => {
    // New ESP32 server doesn't support autonomous mode
    Alert.alert(
      "Feature Not Available",
      "Autonomous mode is not supported by this ESP32 server",
      [{ text: "OK" }]
    )
    return
  }, [])

  const toggleVideoMode = useCallback(() => {
    // New ESP32 server doesn't support video mode  
    Alert.alert(
      "Feature Not Available",
      "Video mode is not supported by this ESP32 server",
      [{ text: "OK" }]
    )
    return
  }, [])

  const handleRecording = useCallback((shouldRecord: boolean) => {
    // New ESP32 server doesn't support recording
    Alert.alert(
      "Feature Not Available", 
      "Recording is not supported by this ESP32 server",
      [{ text: "OK" }]
    )
    return
  }, []);

  // Enhanced dpad handler with server-compatible format
  const websocketWrapperRef = useRef<WebSocketAnimatedWrapperRef>(null);

  // Updated dpad handler for continuous movement with 'hold' property
  const commandInterval = useRef<NodeJS.Timeout | null>(null);

  const sendCommand = (speed: number, turn: number, hold: boolean) => {
    if (!isConnected) return;
    const command: TypedWebSocketMessage = {
      speed: parseFloat(speed.toFixed(precision)),
      turn: parseFloat(turn.toFixed(precision)),
      hold
    };
    sendWebSocketMessage(command);
    if (websocketWrapperRef.current) {
      websocketWrapperRef.current.triggerPulse();
    }
  };

  const startMoving = (x: number, y: number) => {
    // Convert dpad x,y to speed/turn
    const speed = Math.max(-1, Math.min(1, -y));
    const turn = Math.max(-1, Math.min(1, x));
    sendCommand(speed, turn, true);
    // Start interval for continuous movement
    if (commandInterval.current) clearInterval(commandInterval.current);
    commandInterval.current = setInterval(() => {
      sendCommand(speed, turn, true);
    }, 100);
  };

  const stopMoving = () => {
    if (commandInterval.current) {
      clearInterval(commandInterval.current);
      commandInterval.current = null;
    }
    sendCommand(0, 0, false);
  };

  // Pass startMoving/stopMoving to DirectionalPad
  const handleDpadMove = useCallback((x: number, y: number) => {
    if (x === 0 && y === 0) {
      stopMoving();
    } else {
      startMoving(x, y);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <BackgroundView colors={COLORS} videoMode={videoMode} />
        
        <TopNavigation 
          isConnected={isConnected}
          autonomousMode={autonomousMode}
          batteryLevel={batteryLevel}
          batteryStyle={batteryStyle}
          videoMode={videoMode}
          toggleVideoMode={toggleVideoMode}
          toggleDetailPanel={toggleDetailPanel}
          toggleAutonomousMode={toggleAutonomousMode}
          colors={COLORS}
        />
        
        <EnvironmentalInfo 
          autonomousMode={autonomousMode}
          warningColor={COLORS.warning}
        />
        
        {/* Ensure dpad has maximum space - positioned in center */}
        <View style={styles.dpadContainer}>
          <DirectionalPad 
            onMove={handleDpadMove}
            videoMode={videoMode}
          />
        </View>
        
        <ControlPanel 
          isRecording={isRecording}
          setIsRecording={handleRecording}
          isConnected={isConnected}
          disconnect={handleDisconnect}
          emergencyStop={emergencyStop}
          stopButtonStyle={stopButtonStyle}
          colors={COLORS}
          videoMode={videoMode}
          serverAddress={serverAddress}
        />
        
        <DetailPanel 
          style={detailPanelStyle}
          isVisible={showDetailPanel}
          toggleDetailPanel={toggleDetailPanel}
          batteryLevel={batteryLevel}
          connectionType={connectionType}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

// Update the constants for better performance
const styles = StyleSheet.create({
  dpadContainer: {
    position: 'absolute',
    bottom: height * 0.15,
    left: width * 0.1,
    right: width * 0.1,
    height: height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
})