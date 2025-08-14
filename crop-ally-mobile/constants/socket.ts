// Socket configuration constants
export const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'ws://172.20.10.8:5000';
export const RECONNECT_INTERVAL = 5000 as const;

// WebSocket message types that match the Python server
export type WebSocketMessageType = 
  | 'tank'        // Tank drive motor control commands
  | 'joystick'    // Legacy motor control commands (deprecated)
  | 'stop'        // Emergency stop
  | 'record'      // Recording commands
  | 'mode'        // Mode switching
  | 'status'      // Status updates
  | 'welcome'     // Server welcome message
  | 'telemetry'   // Telemetry data (if needed)
  | 'error';      // Error messages

// Tank drive command data for tank type
export interface TankData {
  left: number;   // Motor speed for left side (-1 to 1)
  right: number;  // Motor speed for right side (-1 to 1)
}

// Recording command data
export interface RecordData {
  action: 'start' | 'stop';
}

// Mode types that match Python server
export type ModeType = 'AUTONOMOUS' | 'MANUAL';

// WebSocket message interfaces
export interface WebSocketMessage {
  type: WebSocketMessageType;
  [key: string]: any; // Allow additional properties
}

export interface TankMessage extends WebSocketMessage {
  type: 'tank';
  left: number;
  right: number;
}

export interface JoystickMessage extends WebSocketMessage {
  type: 'joystick';
  left: number;
  right: number;
}

export interface StopMessage extends WebSocketMessage {
  type: 'stop';
}

export interface RecordMessage extends WebSocketMessage {
  type: 'record';
  action: 'start' | 'stop';
}

export interface ModeMessage extends WebSocketMessage {
  type: 'mode';
  mode: ModeType;
}

export interface StatusMessage extends WebSocketMessage {
  type: 'status';
  data: string;
}

export interface WelcomeMessage extends WebSocketMessage {
  type: 'welcome';
  message: string;
}

export type TypedWebSocketMessage = 
  | { type: 'tank'; left: number; right: number }
  | { type: 'joystick'; left: number; right: number }
  | { type: 'stop' }
  | { type: 'record'; action: 'start' | 'stop' }
  | { type: 'mode'; mode: 'AUTONOMOUS' | 'MANUAL' }
  | { speed: number; turn: number; hold: boolean }; // ESP32 continuous movement format

export type ServerMessage = 
  | { type: 'welcome'; message: string }
  | { type: 'status'; data: string };