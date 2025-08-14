export interface RobotProfile {
  id: string
  name: string
  type: 'raspberry-pi' | 'esp32' | 'custom'
  defaultPort: number
  wsPath: string // WebSocket endpoint path
  description: string
  features: {
    camera: boolean
    recording: boolean
    autonomous: boolean
    telemetry: boolean
  }
  connectionConfig: {
    protocol: 'websocket'
    timeout: number
    retryAttempts: number
    heartbeatInterval: number
  }
}

export const ROBOT_PROFILES: RobotProfile[] = [
  {
    id: 'raspberry-pi',
    name: 'Raspberry Pi Robot',
    type: 'raspberry-pi',
    defaultPort: 5000,
    wsPath: '/', // Python server uses root path
    description: 'Standard Raspberry Pi robot with GPIO motor control',
    features: {
      camera: true,
      recording: true,
      autonomous: true,
      telemetry: true
    },
    connectionConfig: {
      protocol: 'websocket',
      timeout: 10000,
      retryAttempts: 3,
      heartbeatInterval: 5000
    }
  },
  {
    id: 'esp32',
    name: 'ESP32 Robot',
    type: 'esp32',
    defaultPort: 81, // New ESP32 server uses port 81
    wsPath: '', // New ESP32 server uses direct WebSocket connection without path
    description: 'ESP32-based robot with L298N motor drivers and basic movement control',
    features: {
      camera: false,     // Not supported in new server
      recording: false,  // Not supported in new server  
      autonomous: false, // Not supported in new server
      telemetry: false   // Not supported in new server
    },
    connectionConfig: {
      protocol: 'websocket',
      timeout: 8000,
      retryAttempts: 5,
      heartbeatInterval: 3000
    }
  },
  {
    id: 'custom',
    name: 'Custom Robot',
    type: 'custom',
    defaultPort: 5000,
    wsPath: '/', // Default to root path
    description: 'Custom robot configuration',
    features: {
      camera: false,
      recording: false,
      autonomous: false,
      telemetry: false
    },
    connectionConfig: {
      protocol: 'websocket',
      timeout: 10000,
      retryAttempts: 3,
      heartbeatInterval: 5000
    }
  }
]

export const getProfileById = (id: string): RobotProfile | undefined => {
  return ROBOT_PROFILES.find(profile => profile.id === id)
}

export const getDefaultProfile = (): RobotProfile => {
  return ROBOT_PROFILES.find(p => p.id === 'esp32') || ROBOT_PROFILES[0] // ESP32 as default
}
