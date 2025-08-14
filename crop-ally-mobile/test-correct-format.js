const WebSocket = require('ws');

// Test the corrected speed/turn format
const serverUrl = 'ws://172.20.10.8:81';

console.log(`Testing corrected format: speed/turn with ${serverUrl}...`);

const ws = new WebSocket(serverUrl);

ws.on('open', function open() {
  console.log('✅ Connected to ESP32 robot server!');
  
  // Test forward movement
  setTimeout(() => {
    console.log('\n📤 Forward movement');
    ws.send(JSON.stringify({ speed: 0.7, turn: 0 }));
  }, 1000);
  
  // Test turning right while moving
  setTimeout(() => {
    console.log('\n📤 Forward + right turn');
    ws.send(JSON.stringify({ speed: 0.5, turn: 0.5 }));
  }, 2000);
  
  // Test turning left while moving
  setTimeout(() => {
    console.log('\n📤 Forward + left turn');
    ws.send(JSON.stringify({ speed: 0.5, turn: -0.5 }));
  }, 3000);
  
  // Test backward
  setTimeout(() => {
    console.log('\n📤 Backward movement');
    ws.send(JSON.stringify({ speed: -0.5, turn: 0 }));
  }, 4000);
  
  // Test stop
  setTimeout(() => {
    console.log('\n🛑 Stop movement');
    ws.send(JSON.stringify({ speed: 0, turn: 0 }));
    setTimeout(() => ws.close(), 1000);
  }, 5000);
});

ws.on('message', function message(data) {
  try {
    const parsed = JSON.parse(data);
    console.log('📥 Server response:', parsed);
  } catch (error) {
    console.log('📥 Raw response:', data.toString());
  }
});

ws.on('error', function error(err) {
  console.log('❌ WebSocket error:', err.message);
});

ws.on('close', function close() {
  console.log('🔌 Connection closed - Movement test complete!');
});
