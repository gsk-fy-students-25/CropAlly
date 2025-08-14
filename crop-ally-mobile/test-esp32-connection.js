const WebSocket = require('ws');

// Test ESP32 WebSocket connection with correct settings
const serverUrl = 'ws://172.20.10.8:81'; // ESP32 server on port 81

console.log(`Testing ESP32 connection to ${serverUrl}...`);

const ws = new WebSocket(serverUrl);

ws.on('open', function open() {
  console.log('✅ Connected to ESP32 robot server!');
  
  // Send a test movement command
  setTimeout(() => {
    const moveCommand = {
      type: 'tank',
      left: 0.5,
      right: 0.3
    };
    ws.send(JSON.stringify(moveCommand));
    console.log('📤 Sent movement command:', moveCommand);
  }, 1000);
  
  // Send stop command after 2 seconds
  setTimeout(() => {
    const stopCommand = {
      type: 'stop'
    };
    ws.send(JSON.stringify(stopCommand));
    console.log('📤 Sent stop command:', stopCommand);
    
    // Close connection
    setTimeout(() => {
      ws.close();
    }, 500);
  }, 2000);
});

ws.on('message', function message(data) {
  try {
    const parsed = JSON.parse(data);
    console.log('📥 Received from ESP32:', parsed);
  } catch (error) {
    console.log('📥 Received raw data:', data.toString());
  }
});

ws.on('error', function error(err) {
  console.log('❌ WebSocket error:', err.message);
});

ws.on('close', function close() {
  console.log('🔌 Connection closed');
});
