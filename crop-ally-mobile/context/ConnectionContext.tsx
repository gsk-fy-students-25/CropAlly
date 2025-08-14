"use client"

import { getDefaultProfile, RobotProfile } from "@/constants/robotProfiles"
import { TypedWebSocketMessage } from "@/constants/socket"
import * as Haptics from "expo-haptics"
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react"
import { Alert } from "react-native"

// Mock saved connections for demo purposes - ESP32 focused
const MOCK_SAVED_CONNECTIONS: Connection[] = [
  { 
    name: "ESP32 Robot", 
    address: "172.20.10.8", 
    lastConnected: "2025-08-07", 
    protocol: "websocket",
    robotProfile: {
      id: 'esp32',
      name: 'ESP32 Robot',
      type: 'esp32',
      defaultPort: 81,
      wsPath: '',
      description: 'ESP32-based robot with AsyncWebServer and camera',
      features: { camera: true, recording: true, autonomous: true, telemetry: false },
      connectionConfig: { protocol: 'websocket', timeout: 8000, retryAttempts: 5, heartbeatInterval: 3000 }
    }
  },
  { 
    name: "ESP32 Robot (WiFi Direct)", 
    address: "192.168.4.1", 
    lastConnected: "2025-08-06", 
    protocol: "websocket",
    robotProfile: {
      id: 'esp32',
      name: 'ESP32 Robot',
      type: 'esp32',
      defaultPort: 81,
      wsPath: '',
      description: 'ESP32-based robot with AsyncWebServer and camera',
      features: { camera: true, recording: true, autonomous: true, telemetry: false },
      connectionConfig: { protocol: 'websocket', timeout: 8000, retryAttempts: 5, heartbeatInterval: 3000 }
    }
  },
  { 
    name: "ESP32 Robot (Local)", 
    address: "192.168.1.100", 
    lastConnected: "2025-08-05", 
    protocol: "websocket",
    robotProfile: {
      id: 'esp32',
      name: 'ESP32 Robot',
      type: 'esp32',
      defaultPort: 81,
      wsPath: '',
      description: 'ESP32-based robot with AsyncWebServer and camera',
      features: { camera: true, recording: true, autonomous: true, telemetry: false },
      connectionConfig: { protocol: 'websocket', timeout: 8000, retryAttempts: 5, heartbeatInterval: 3000 }
    }
  }
]

// Connection protocol types - WiFi only with two protocol options
type ConnectionType = "websocket" | "mqtt"

// Connection status for more granular state management
type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error" | "reconnecting"

// Define types for our context data
interface TelemetryData {
  battery: number
  temperature: number
  position: { x: number; y: number }
  speed: number
  status: string
}

interface CommandEntry {
  text: string
  timestamp: Date
}

interface Connection {
  name: string
  address: string
  lastConnected: string
  protocol: ConnectionType
  robotProfile?: RobotProfile
}

interface ConnectionContextType {
  isConnected: boolean
  connectionStatus: ConnectionStatus
  serverAddress: string
  connectionType: ConnectionType
  savedConnections: Connection[]
  lastConnection: Connection | null
  commandLog: CommandEntry[]
  telemetryData: TelemetryData
  currentRobotProfile: RobotProfile
  connect: (address: string, robotProfile?: RobotProfile) => Promise<boolean>
  disconnect: () => void
  reconnect: () => Promise<boolean>
  setConnectionType: (type: ConnectionType) => void
  setRobotProfile: (profile: RobotProfile) => void
  sendCommand: (command: string) => void
  sendWebSocketMessage: (message: TypedWebSocketMessage) => void
  connectionError: string | null
}

// Create context with proper typing
const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined)

export const useConnection = (): ConnectionContextType => {
  const context = useContext(ConnectionContext)
  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider")
  }
  return context
}

interface ConnectionProviderProps {
  children: ReactNode
}

const WEBSOCKET_TIMEOUT = 10000 // 10 seconds
const RECONNECT_DELAY = 2000 // 2 seconds

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected")
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [connectionType, setConnectionType] = useState<ConnectionType>("websocket") // Default to WebSocket
  const [serverAddress, setServerAddress] = useState<string>("")
  const [savedConnections, setSavedConnections] = useState<Connection[]>(MOCK_SAVED_CONNECTIONS)
  const [lastConnection, setLastConnection] = useState<Connection | null>(MOCK_SAVED_CONNECTIONS[0])
  const [currentRobotProfile, setCurrentRobotProfile] = useState<RobotProfile>(getDefaultProfile())
  
  // Command and telemetry data
  const [commandLog, setCommandLog] = useState<CommandEntry[]>([])
  const [telemetryData, setTelemetryData] = useState<TelemetryData>({
    battery: 75,
    temperature: 32,
    position: { x: 0, y: 0 },
    speed: 0,
    status: "Idle",
  })

  // References for intervals and timeouts
  const telemetryIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const maxReconnectAttempts = 3
  const reconnectAttemptsRef = useRef(0)
  
  const wsRef = useRef<WebSocket | null>(null)
  const isConnectingRef = useRef(false)

  // Connection health monitoring
  const startConnectionMonitoring = () => {
    // Clear any existing heartbeat interval
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }
    
    // Set up a new heartbeat check
    heartbeatIntervalRef.current = setInterval(() => {
      if (connectionType === "websocket" && wsRef.current) {
        // For WebSocket, check readyState
        if (wsRef.current.readyState !== WebSocket.OPEN) {
          handleConnectionLost()
        }
      } else {
        // For MQTT or when WebSocket is not established yet, simulate random drops (1% chance)
        if (Math.random() < 0.01) {
          handleConnectionLost()
        }
      }
    }, 5000)
  }
  
  // Handle connection loss
  const handleConnectionLost = () => {
    // Stop monitoring
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }
    
    // Stop telemetry
    if (telemetryIntervalRef.current) {
      clearInterval(telemetryIntervalRef.current)
      telemetryIntervalRef.current = null
    }
    
    // Close WebSocket if it exists
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    // Update connection state
    setIsConnected(false)
    setConnectionStatus("error")
    setConnectionError("Connection to robot lost")
    
    // Provide haptic feedback for connection loss
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    
    // Attempt to reconnect if we have an address
    if (serverAddress && reconnectAttemptsRef.current < maxReconnectAttempts) {
      attemptReconnect()
    }
  }
  
  // Attempt to reconnect
  const attemptReconnect = () => {
    // Don't attempt if we're already trying to reconnect
    if (connectionStatus === "reconnecting") return
    
    setConnectionStatus("reconnecting")
    reconnectAttemptsRef.current += 1
    
    // Wait 3 seconds before trying to reconnect
    reconnectTimeoutRef.current = setTimeout(async () => {
      try {
        await connect(serverAddress)
      } catch (error) {
        // If reconnect fails and we still have attempts left, try again
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          attemptReconnect()
        } else {
          // Max attempts reached, give up
          setConnectionStatus("error")
          setConnectionError("Failed to reconnect after multiple attempts")
        }
      }
    }, 3000)
  }

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (telemetryIntervalRef.current) clearInterval(telemetryIntervalRef.current)
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current)
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
      
      // Close WebSocket if it exists
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [])

  // Enhanced sendWebSocketMessage with better error handling
  const sendWebSocketMessage = useCallback((message: any) => {
    // Don't send if not connected
    if (!isConnected || !wsRef.current) {
      console.log("WebSocket not connected, skipping message:", message.type)
      return false
    }

    // Check WebSocket state
    if (wsRef.current.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not ready, current state:", wsRef.current.readyState)
      return false
    }

    try {
      const messageString = JSON.stringify(message)
      wsRef.current.send(messageString)
      
      // Only log non-joystick messages to reduce console spam
      if (message.type !== 'joystick') {
        console.log("Sent WebSocket message:", message.type)
      }
      
      return true
    } catch (error) {
      console.error("Failed to send WebSocket message:", error)
      
      // Don't close connection on send failures, just skip the message
      // This prevents disconnections during rapid joystick movements
      return false
    }
  }, [isConnected])

  // Enhanced connect function with better error handling and robot profile support
  const connect = useCallback(async (address: string, robotProfile?: RobotProfile): Promise<boolean> => {
    if (!address) {
      Alert.alert("Error", "Please enter a server address")
      return false
    }

    if (isConnectingRef.current) {
      console.log("Already connecting, please wait...")
      return false
    }

    // Update robot profile if provided
    if (robotProfile) {
      setCurrentRobotProfile(robotProfile)
    }

    isConnectingRef.current = true
    setConnectionStatus("connecting")
    setConnectionError(null)
    reconnectAttemptsRef.current = 0

    try {
      // Clean up any existing connection
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }

      // Construct WebSocket URL with correct path based on robot profile
      const profile = robotProfile || currentRobotProfile
      let wsUrl: string
      
      if (address.startsWith('ws://')) {
        // Full URL provided, append wsPath if not already included
        wsUrl = address.includes('/ws') ? address : address + profile.wsPath
      } else {
        // Just IP provided, construct full URL
        wsUrl = `ws://${address}:${profile.defaultPort}${profile.wsPath}`
      }
      
      console.log("Connecting to WebSocket:", wsUrl)

      return new Promise((resolve) => {
        const ws = new WebSocket(wsUrl)
        let resolved = false
        
        // Set timeout for connection
        const timeout = setTimeout(() => {
          if (!resolved) {
            resolved = true
            console.log("WebSocket connection timeout")
            ws.close()
            setConnectionStatus("error")
            setIsConnected(false)
            isConnectingRef.current = false
            resolve(false)
          }
        }, WEBSOCKET_TIMEOUT)

        ws.onopen = () => {
          if (!resolved) {
            resolved = true
            clearTimeout(timeout)
            console.log("WebSocket connected successfully")
            
            wsRef.current = ws
            setIsConnected(true)
            setConnectionStatus("connected")
            setServerAddress(wsUrl)
            isConnectingRef.current = false
            
            // Save connection info
            const now = new Date().toISOString().slice(0, 10)
            const existingConnection = savedConnections.find((conn) => conn.address === address)

            if (existingConnection) {
              const updatedConnections = savedConnections.map((conn) =>
                conn.address === address ? { ...conn, lastConnected: now, protocol: connectionType } : conn
              )
              setSavedConnections(updatedConnections)
              setLastConnection({...existingConnection, protocol: connectionType})
            } else {
              const newConnection = {
                name: `Robot ${savedConnections.length + 1}`,
                address,
                lastConnected: now,
                protocol: connectionType
              }
              setSavedConnections([...savedConnections, newConnection])
              setLastConnection(newConnection)
            }

            // Start monitoring and telemetry
            startConnectionMonitoring()
            
            if (telemetryIntervalRef.current) {
              clearInterval(telemetryIntervalRef.current)
            }
            
            telemetryIntervalRef.current = setInterval(() => {
              setTelemetryData((prev) => ({
                ...prev,
                battery: Math.max(0, prev.battery - Math.random()),
                temperature: 30 + Math.random() * 5,
                speed: Math.random() * 2,
                position: {
                  x: prev.position.x + (Math.random() - 0.5) * 2,
                  y: prev.position.y + (Math.random() - 0.5) * 2,
                },
              }))
            }, 3000)
            
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            resolve(true)
          }
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            console.log("Received WebSocket message:", data)
            
            switch (data.type) {
              case 'welcome':
                console.log("Server welcome:", data.message)
                break
              case 'status':
                if (data.data === 'connected') {
                  console.log("Server confirmed connection")
                }
                break
              default:
                console.log("Unhandled message type:", data.type)
            }
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error)
          }
        }

        ws.onerror = (error) => {
          if (!resolved) {
            resolved = true
            clearTimeout(timeout)
            console.error("WebSocket error:", error)
            setConnectionStatus("error")
            setIsConnected(false)
            isConnectingRef.current = false
            resolve(false)
          }
        }

        ws.onclose = (event) => {
          console.log("WebSocket closed:", event.code, event.reason)
          
          if (wsRef.current === ws) {
            wsRef.current = null
            setIsConnected(false)
            setConnectionStatus("disconnected")
          }
          
          if (!resolved) {
            resolved = true
            clearTimeout(timeout)
            isConnectingRef.current = false
            resolve(false)
          }
        }
      })
    } catch (error) {
      console.error("Connection error:", error)
      setConnectionStatus("error")
      setConnectionError(error instanceof Error ? error.message : String(error))
      setIsConnected(false)
      isConnectingRef.current = false
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      return false
    }
  }, [savedConnections, connectionType])

  // Reconnect to the last address
  const reconnect = async (): Promise<boolean> => {
    if (!serverAddress) {
      if (lastConnection) {
        // Set connection type to the saved protocol before reconnecting
        if (lastConnection.protocol) {
          setConnectionType(lastConnection.protocol)
        }
        return connect(lastConnection.address)
      }
      
      setConnectionError("No previous connection to reconnect to")
      return false
    }
    
    return connect(serverAddress)
  }

  // Disconnect function
  const disconnect = () => {
    // Close WebSocket if it exists
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    // Clear all intervals
    if (telemetryIntervalRef.current) {
      clearInterval(telemetryIntervalRef.current)
      telemetryIntervalRef.current = null
    }
    
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
    // Reset reconnect attempts
    reconnectAttemptsRef.current = 0
    
    // Update state
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    setConnectionStatus("disconnected")
    setIsConnected(false)
    setConnectionError(null)
  }

  // Set robot profile function
  const setRobotProfile = useCallback((profile: RobotProfile) => {
    setCurrentRobotProfile(profile)
    console.log(`🤖 Robot profile updated to: ${profile.name}`)
  }, [])

  const sendCommand = (command: string) => {
    if (!isConnected) {
      Alert.alert("Error", "Not connected to robot")
      return
    }

    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    // Send command based on connection type
    if (connectionType === "websocket" && wsRef.current) {
      try {
        wsRef.current.send(JSON.stringify({ command }))
      } catch (error) {
        console.error("Failed to send command over WebSocket", error)
        Alert.alert("Error", "Failed to send command to robot")
        return
      }
    } else if (connectionType === "mqtt") {
      // Simulate MQTT publish
      console.log(`MQTT publish: ${command}`)
    }

    // Add command to log
    setCommandLog((prev) => [...prev, { text: command, timestamp: new Date() }])

    // Simulate robot status change
    setTelemetryData((prev) => ({
      ...prev,
      status: command === "stop" ? "Idle" : `Moving ${command}`,
    }))
  }

  return (
    <ConnectionContext.Provider
      value={{
        isConnected,
        connectionStatus,
        serverAddress,
        connectionType,
        savedConnections,
        lastConnection,
        commandLog,
        telemetryData,
        currentRobotProfile,
        connect,
        disconnect,
        reconnect,
        setConnectionType,
        setRobotProfile,
        sendCommand,
        sendWebSocketMessage,
        connectionError
      }}
    >
      {children}
    </ConnectionContext.Provider>
  )
}