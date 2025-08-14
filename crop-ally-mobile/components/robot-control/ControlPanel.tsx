import { Feather } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import React from "react"
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Animated from "react-native-reanimated"

interface ControlPanelProps {
  isRecording: boolean
  setIsRecording: (value: boolean) => void
  isConnected: boolean
  disconnect: () => void
  emergencyStop: () => void
  stopButtonStyle: any
  colors: any
  videoMode: boolean
  serverAddress: string | undefined
}

export function ControlPanel({
  isRecording,
  setIsRecording,
  isConnected,
  disconnect,
  emergencyStop,
  stopButtonStyle,
  colors,
  videoMode,
  serverAddress,
}: ControlPanelProps) {
  // Convert ws://172.20.10.2:5000 to 172.20.10.2
  const displayAddress = serverAddress ? 
    serverAddress.replace(/^ws:\/\/|^mqtt:\/\//, '').split(':')[0] : 
    'Not connected'
  
  return (
    <>
      {/* Connection Status - Top center */}
      <View style={styles.connectionContainer}>
        <BlurView intensity={30} tint="dark" style={styles.connectionBlur}>
          <View style={styles.connectionStatus}>
            <View style={[
              styles.connectionIndicator, 
              { backgroundColor: isConnected ? colors.primary : colors.danger }
            ]} />
            <Text style={[styles.connectionText, { color: colors.textPrimary }]}>
              {displayAddress}
            </Text>
            
            {/* Disconnect button - only show when connected */}
            {isConnected && (
              <TouchableOpacity 
                style={[styles.smallButton, { borderColor: colors.border }]}
                onPress={disconnect}
              >
                <Feather name="log-out" size={14} color={colors.danger} />
              </TouchableOpacity>
            )}
          </View>
        </BlurView>
      </View>
      
      {/* Emergency Stop Button - Top left corner */}
      <View style={styles.emergencyContainer}>
        <BlurView intensity={30} tint="dark" style={styles.emergencyBlur}>
          <Animated.View style={[styles.emergencyStopContainer, stopButtonStyle]}>
            <TouchableOpacity 
              style={[styles.emergencyStop, { backgroundColor: colors.danger }]}
              onPress={emergencyStop}
              activeOpacity={0.8}
            >
              <Feather name="x-octagon" size={20} color="#ffffff" />
              <Text style={styles.emergencyStopText}>STOP</Text>
            </TouchableOpacity>
          </Animated.View>
        </BlurView>
      </View>
      
      {/* Recording Button - Top right corner, only in video mode */}
      {videoMode && (
        <View style={styles.recordingContainer}>
          <BlurView intensity={30} tint="dark" style={styles.recordingBlur}>
            <TouchableOpacity 
              style={[
                styles.recordButton, 
                { 
                  backgroundColor: isRecording ? 
                    'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  borderColor: isRecording ? colors.danger : colors.border,
                }
              ]}
              onPress={() => setIsRecording(!isRecording)}
            >
              <View style={[
                styles.recordIndicator, 
                { backgroundColor: isRecording ? colors.danger : 'transparent' }
              ]} />
              <Text style={[
                styles.recordText, 
                { color: isRecording ? colors.danger : colors.textPrimary }
              ]}>
                {isRecording ? "REC" : "REC"}
              </Text>
            </TouchableOpacity>
          </BlurView>
        </View>
      )}
    </>
  )
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  // Connection status in top center
  connectionContainer: {
    position: 'absolute',
    top: 70, // Below the top navigation
    left: width / 2 - 100, // Center horizontally
    zIndex: 10,
  },
  connectionBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  connectionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connectionText: {
    fontSize: 12,
    marginRight: 8,
  },
  smallButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  
  // Emergency stop in top left
  emergencyContainer: {
    position: 'absolute',
    top: 70, // Below the top navigation
    left: 16,
    zIndex: 10,
  },
  emergencyBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  emergencyStopContainer: {
    padding: 6,
  },
  emergencyStop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emergencyStopText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 12,
  },
  
  // Recording button in top right
  recordingContainer: {
    position: 'absolute',
    top: 70, // Below the top navigation
    right: 16,
    zIndex: 10,
  },
  recordingBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  recordIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  recordText: {
    fontSize: 12,
    fontWeight: '500',
  },
})