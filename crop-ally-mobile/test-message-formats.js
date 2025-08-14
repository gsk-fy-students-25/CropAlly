const WebSocket = require('ws');

// Test different message formats with ESP32
const serverUrl = 'ws://172.20.10.8:81';

console.log(`Testing different message formats with ${serverUrl}...`);

const ws = new WebSocket(serverUrl);

ws.on('open', function open() {
  console.log('✅ Connected to ESP32 robot server!');
  
  setTimeout(() => {
    console.log('\n🧪 Testing Format 1: tank type');
    ws.send(JSON.stringify({ type: 'tank', left: 0.5, right: 0.5 }));
  }, 1000);
  
  setTimeout(() => {
    console.log('\n🧪 Testing Format 2: joystick type');
    ws.send(JSON.stringify({ type: 'joystick', left: 0.5, right: 0.5 }));
  }, 2000);
  
  setTimeout(() => {
    console.log('\n🧪 Testing Format 3: speed/turn values');
    ws.send(JSON.stringify({ speed: 0.5, turn: 0.2 }));
  }, 3000);
  
  setTimeout(() => {
    console.log('\n🧪 Testing Format 4: motor values');
    ws.send(JSON.stringify({ leftMotor: 0.5, rightMotor: 0.5 }));
  }, 4000);
  
  setTimeout(() => {
    console.log('\n🧪 Testing Format 5: simple forward');
    ws.send(JSON.stringify({ forward: 0.5 }));
  }, 5000);
  
  setTimeout(() => {
    console.log('\n🛑 Sending stop command');
    ws.send(JSON.stringify({ type: 'stop' }));
    setTimeout(() => ws.close(), 1000);
  }, 6000);
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
