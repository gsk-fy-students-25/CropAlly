const WebSocket = require('ws');

// Test the new continuous movement format with hold property
const serverUrl = 'ws://172.20.10.8:81';

console.log(`Testing new continuous movement format with ${serverUrl}...`);

const ws = new WebSocket(serverUrl);

ws.on('open', function open() {
  console.log('✅ Connected to ESP32 robot server!');
  
  // Test continuous forward movement with hold: true
  setTimeout(() => {
    console.log('\n📤 Starting continuous forward movement (hold: true)');
    ws.send(JSON.stringify({ speed: 0.7, turn: 0, hold: true }));
  }, 1000);
  
  // Send more commands while holding
  setTimeout(() => {
    console.log('📤 Continuing movement (hold: true)');
    ws.send(JSON.stringify({ speed: 0.7, turn: 0, hold: true }));
  }, 1200);
  
  setTimeout(() => {
    console.log('📤 Continuing movement (hold: true)');
    ws.send(JSON.stringify({ speed: 0.7, turn: 0, hold: true }));
  }, 1400);
  
  // Test turning while moving
  setTimeout(() => {
    console.log('\n📤 Forward + right turn (hold: true)');
    ws.send(JSON.stringify({ speed: 0.5, turn: 0.5, hold: true }));
  }, 2000);
  
  // Test stop command with hold: false
  setTimeout(() => {
    console.log('\n🛑 Stop movement (hold: false)');
    ws.send(JSON.stringify({ speed: 0, turn: 0, hold: false }));
    setTimeout(() => ws.close(), 1000);
  }, 3000);
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
  console.log('🔌 Connection closed - Continuous movement test complete!');
});
