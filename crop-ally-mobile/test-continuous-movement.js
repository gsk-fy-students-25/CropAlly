const WebSocket = require('ws');

// Test continuous movement with the new tank format
const serverUrl = 'ws://172.20.10.8:81';

console.log(`Testing continuous movement to ${serverUrl}...`);

const ws = new WebSocket(serverUrl);

ws.on('open', function open() {
  console.log('✅ Connected to ESP32 robot server!');
  
  // Test continuous forward movement
  console.log('📤 Starting continuous forward movement...');
  let moveCount = 0;
  
  const moveInterval = setInterval(() => {
    moveCount++;
    const command = {
      type: 'tank',
      left: 0.5,
      right: 0.5
    };
    ws.send(JSON.stringify(command));
    console.log(`📤 Move command ${moveCount}:`, command);
    
    // Stop after 10 commands (about 1 second)
    if (moveCount >= 10) {
      clearInterval(moveInterval);
      
      // Send stop command
      setTimeout(() => {
        const stopCommand = { type: 'stop' };
        ws.send(JSON.stringify(stopCommand));
        console.log('📤 Sent stop command');
        
        setTimeout(() => ws.close(), 500);
      }, 200);
    }
  }, 100); // Send every 100ms like the app does
});

ws.on('message', function message(data) {
  try {
    const parsed = JSON.parse(data);
    console.log('📥 Response:', parsed);
  } catch (error) {
    console.log('📥 Raw response:', data.toString());
  }
});

ws.on('error', function error(err) {
  console.log('❌ WebSocket error:', err.message);
});

ws.on('close', function close() {
  console.log('🔌 Connection closed');
});
