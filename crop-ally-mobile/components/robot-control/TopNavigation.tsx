import { Feather } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Animated from "react-native-reanimated"

interface TopNavigationProps {
  isConnected: boolean
  autonomousMode: boolean
  batteryLevel: number
  batteryStyle: any
  videoMode: boolean
  toggleVideoMode: () => void
  toggleDetailPanel: () => void
  toggleAutonomousMode: () => void
  colors: any
}

export function TopNavigation({
  isConnected,
  autonomousMode,
  batteryLevel,
  batteryStyle,
  videoMode,
  toggleVideoMode,
  toggleDetailPanel,
  toggleAutonomousMode,
  colors,
}: TopNavigationProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Format time as HH:MM
  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  })
  
  return (
    <View style={styles.container}>
      <BlurView 
        intensity={30} 
        tint="dark"
        style={styles.headerBlur}
      >
        <View style={styles.headerContent}>
          {/* Left - Back button */}
          <TouchableOpacity 
            style={[styles.iconButton, { borderColor: colors.border }]} 
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
          
          {/* Center - Status info */}
          <View style={styles.statusContainer}>
            {/* Connection status */}
            <View style={styles.statusItem}>
              <View style={[
                styles.statusIndicator, 
                { 
                  backgroundColor: isConnected ? colors.primary : colors.danger 
                }
              ]} />
              <Text style={[styles.statusText, { color: colors.textPrimary }]}>
                {isConnected ? `Connected` : "Not Connected"}
              </Text>
            </View>
            
            {/* Time */}
            <View style={styles.statusItem}>
              <Feather name="clock" size={12} color={colors.textSecondary} style={styles.statusIcon} />
              <Text style={[styles.statusText, { color: colors.textPrimary }]}>{formattedTime}</Text>
            </View>
            
            {/* Battery */}
            <View style={styles.statusItem}>
              <Animated.View style={batteryStyle}>
                <Feather 
                  name={batteryLevel > 20 ? "battery" : "battery-charging"} 
                  size={12} 
                  color={batteryLevel > 30 ? colors.primary : colors.warning} 
                  style={styles.statusIcon} 
                />
              </Animated.View>
              <Text 
                style={[
                  styles.statusText, 
                  { 
                    color: batteryLevel > 30 ? colors.textPrimary : colors.warning 
                  }
                ]}
              >
                {batteryLevel}%
              </Text>
            </View>
          </View>
          
          {/* Right - Mode controls */}
          <View style={styles.rightControls}>
            {/* Video/Control toggle */}
            <TouchableOpacity 
              style={[styles.modeButton, { borderColor: colors.border }]} 
              onPress={toggleVideoMode}
            >
              <Feather 
                name={videoMode ? "sliders" : "video"} 
                size={18} 
                color={colors.textPrimary} 
              />
              <Text style={[styles.modeButtonText, { color: colors.textPrimary }]}>
                {videoMode ? "Control" : "Video"}
              </Text>
            </TouchableOpacity>
            
            {/* Autonomous mode toggle */}
            <TouchableOpacity 
              style={[
                styles.modeButton, 
                { 
                  borderColor: colors.border,
                  backgroundColor: autonomousMode ? 
                    'rgba(45, 211, 111, 0.2)' : 'transparent' 
                }
              ]} 
              onPress={toggleAutonomousMode}
            >
              <Feather 
                name={autonomousMode ? "cpu" : "user"} 
                size={18} 
                color={autonomousMode ? colors.primary : colors.textPrimary} 
              />
              <Text 
                style={[
                  styles.modeButtonText, 
                  { 
                    color: autonomousMode ? colors.primary : colors.textPrimary 
                  }
                ]}
              >
                {autonomousMode ? "Auto" : "Manual"}
              </Text>
            </TouchableOpacity>
            
            {/* Details button */}
            <TouchableOpacity 
              style={[styles.iconButton, { borderColor: colors.border }]} 
              onPress={toggleDetailPanel}
            >
              <Feather name="more-vertical" size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </View>
  )
}

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerBlur: {
    overflow: 'hidden',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusIcon: {
    marginRight: 6,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
})