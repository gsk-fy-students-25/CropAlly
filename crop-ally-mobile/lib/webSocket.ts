import { TypedWebSocketMessage } from "@/constants/socket";

/**
 * WebSocket instance for communication with the robot
 */
let socket: WebSocket | null = null;

/**
 * Initialize a WebSocket connection to the robot server
 * @param serverAddress - The IP address or hostname of the robot server
 * @returns The WebSocket instance or null if connection failed
 */
export const initSocket = (serverAddress: string | null): WebSocket | null => {
  if (!serverAddress) {
    console.error("Cannot initialize WebSocket: Server address is null");
    return null;
  }

  try {
    // Format the WebSocket URL
    const wsAddress = serverAddress.startsWith('ws://') 
      ? serverAddress 
      : `ws://${serverAddress}`;
    
    // Add port if not specified
    const formattedAddress = wsAddress.includes(':') 
      ? wsAddress 
      : `${wsAddress}:5000`;
    
    console.log(`Initializing WebSocket connection to ${formattedAddress}`);
    
    // Close existing connection if any
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    
    // Create new WebSocket connection
    socket = new WebSocket(formattedAddress);
    
    // Set up event handlers
    socket.onopen = () => {
      console.log("WebSocket connection established");
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received message from server:", data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
    
    return socket;
  } catch (error) {
    console.error("Error initializing WebSocket:", error);
    return null;
  }
};

/**
 * Send a message to the robot server
 * @param message - The message to send
 * @returns True if the message was sent successfully, false otherwise
 */
export const sendMessage = (message: TypedWebSocketMessage): boolean => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error("Cannot send message: WebSocket is not connected");
    return false;
  }
  
  try {
    const messageString = JSON.stringify(message);
    socket.send(messageString);
    console.log("Sent message:", message);
    return true;
  } catch (error) {
    console.error("Error sending WebSocket message:", error);
    return false;
  }
};

/**
 * Close the WebSocket connection
 */
export const closeSocket = (): void => {
  if (socket) {
    socket.close();
    socket = null;
    console.log("WebSocket connection closed");
  }
};

/**
 * Check if the WebSocket is connected
 * @returns True if connected, false otherwise
 */
export const isSocketConnected = (): boolean => {
  return socket !== null && socket.readyState === WebSocket.OPEN;
};