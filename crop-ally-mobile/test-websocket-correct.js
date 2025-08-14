const WebSocket = require('ws');

// Test WebSocket connection to the Python robot server
const serverUrl = 'ws://172.20.10.8:5000'; // Change this to your server IP

console.log(`Attempting to connect to ${serverUrl}...`);

const ws = new WebSocket(serverUrl);

ws.on('open', function open() {
  console.log('✅ Connected to robot server!');
  
  // Send a welcome message
  console.log('Sending test messages...');
  
  // Test joystick movement
  setTimeout(() => {
    const joystickMsg = {
      type: 'joystick',
      left: 0.5,
      right: 0.3
    };
    ws.send(JSON.stringify(joystickMsg));
    console.log('📤 Sent joystick command:', joystickMsg);
  }, 1000);
  
  // Test mode change
  setTimeout(() => {
    const modeMsg = {
      type: 'mode',
      mode: 'AUTONOMOUS'
    };
    ws.send(JSON.stringify(modeMsg));
    console.log('📤 Sent mode command:', modeMsg);
  }, 2000);
  
  // Test recording
  setTimeout(() => {
    const recordMsg = {
      type: 'record',
      action: 'start'
    };
    ws.send(JSON.stringify(recordMsg));
    console.log('📤 Sent record command:', recordMsg);
  }, 3000);
  
  // Test emergency stop
  setTimeout(() => {
    const stopMsg = {
      type: 'stop'
    };
    ws.send(JSON.stringify(stopMsg));
    console.log('📤 Sent emergency stop:', stopMsg);
  }, 4000);
  
  // Close connection after tests
  setTimeout(() => {
    console.log('🔚 Closing connection...');
    ws.close();
  }, 5000);
});

ws.on('message', function message(data) {
  try {
    const parsed = JSON.parse(data.toString());
    console.log('📥 Received from server:', parsed);
  } catch (e) {
    console.log('📥 Received (raw):', data.toString());
  }
});

ws.on('error', function error(err) {
  console.error('❌ WebSocket error:', err.message);
});

ws.on('close', function close(code, reason) {
  console.log(`🔌 Connection closed. Code: ${code}, Reason: ${reason}`);
});
