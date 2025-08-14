/**
 * Robot Connection Examples
 * 
 * This file demonstrates how to connect to different robot types.
 * Your mobile app now supports both Raspberry Pi and ESP32 robots!
 */

// ESP32 Robot Connection Example
const ESP32_EXAMPLES = {
  // Basic ESP32 connection
  wifi_direct: {
    name: "ESP32 Robot (WiFi Direct)",
    address: "192.168.4.1",  // ESP32 AP mode default IP
    port: 5000,
    profile: "esp32"
  },
  
  // ESP32 on local network
  local_network: {
    name: "ESP32 Robot (Local WiFi)",
    address: "192.168.1.100", // Your ESP32's local IP
    port: 5000,
    profile: "esp32"
  }
}

// Raspberry Pi Robot Connection Example  
const RASPBERRY_PI_EXAMPLES = {
  // Standard Raspberry Pi setup
  local_network: {
    name: "Raspberry Pi Robot",
    address: "172.20.10.3",   // Your Pi's IP address
    port: 5000,
    profile: "raspberry-pi"
  }
}

/**
 * Quick Setup Guide:
 * 
 * FOR ESP32 ROBOT:
 * 1. Flash your Arduino code to ESP32
 * 2. Update WiFi credentials in the code
 * 3. Connect your phone to the same WiFi network
 * 4. In the app, select "ESP32 Robot" profile
 * 5. Enter your ESP32's IP address (find it in Serial Monitor)
 * 6. Tap Connect!
 * 
 * FOR RASPBERRY PI ROBOT:
 * 1. Run your Python WebSocket server on the Pi
 * 2. Make sure both devices are on same network
 * 3. Select "Raspberry Pi Robot" profile
 * 4. Enter your Pi's IP address
 * 5. Tap Connect!
 * 
 * FEATURES BY ROBOT TYPE:
 * 
 * ESP32 Robot:
 * ✅ Joystick Control
 * ✅ Emergency Stop
 * ✅ Recording (if implemented in Arduino)
 * ✅ Autonomous Mode (if implemented)
 * ✅ Camera Stream (if ENABLE_CAMERA is defined)
 * ❌ Real-time Telemetry (not in current Arduino code)
 * 
 * Raspberry Pi Robot:
 * ✅ Joystick Control
 * ✅ Emergency Stop
 * ✅ Recording
 * ✅ Autonomous Mode
 * ✅ Camera Stream
 * ✅ Real-time Telemetry
 */

export const CONNECTION_EXAMPLES = {
  ESP32_EXAMPLES,
  RASPBERRY_PI_EXAMPLES
}
