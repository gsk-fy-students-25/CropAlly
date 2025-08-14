#include <Arduino.h>
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

// Front L298N Motor Driver (controls left and right front motors)
const int LEFT_FRONT_IN1 = 13;     // D13 → IN1 
const int LEFT_FRONT_IN2 = 15;     // D15 → IN2
const int LEFT_FRONT_ENA = 16;     // RX2 → ENA
const int RIGHT_FRONT_IN3 = 17;    // TX2 → IN3
const int RIGHT_FRONT_IN4 = 2;     // D2 → IN4
const int RIGHT_FRONT_ENB = 4;     // D4 → ENB

// Back L298N Motor Driver (controls left and right rear motors)
const int LEFT_REAR_IN1 = 18;      // D18 → IN1
const int LEFT_REAR_IN2 = 19;      // D19 → IN2
const int LEFT_REAR_ENA = 21;      // D21 → ENA
const int RIGHT_REAR_IN3 = 22;     // D22 → IN3
const int RIGHT_REAR_IN4 = 23;     // D23 → IN4
const int RIGHT_REAR_ENB = 25;     // D25 → ENB

// PWM properties
const int PWM_FREQ = 5000;         // 5 KHz frequency
const int PWM_RESOLUTION = 8;      // 8-bit resolution (0-255)
const int PWM_CHANNEL_LF = 0;      // PWM channel for left front
const int PWM_CHANNEL_RF = 1;      // PWM channel for right front
const int PWM_CHANNEL_LR = 2;      // PWM channel for left rear
const int PWM_CHANNEL_RR = 3;      // PWM channel for right rear

// Network credentials
const char* ssid = "Redeemer";
const char* password = "12345678";

// WebSocket server on port 81
WebSocketsServer webSocket = WebSocketsServer(81);

// Robot control variables
float currentSpeed = 0.0;
float turnFactor = 0.0;
unsigned long lastCommandTime = 0;
const unsigned long COMMAND_TIMEOUT = 2000; // 2 seconds
bool holdLastCommand = false; // NEW: Flag to hold last command

// Function prototypes
void moveRobot(float speed, float turn);
void setupMotors();
void onWebSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length);

void setup() {
  Serial.begin(115200);
  
  // Setup motors and PWM channels
  setupMotors();
  
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  
  // Print IP address
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Start WebSocket server
  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);
  Serial.println("WebSocket server started");
}

void loop() {
  webSocket.loop();
  
  // Modified safety feature
  if (millis() - lastCommandTime > COMMAND_TIMEOUT) {
    if (currentSpeed != 0.0 || turnFactor != 0.0) {
      if (!holdLastCommand) {
        currentSpeed = 0.0;
        turnFactor = 0.0;
        moveRobot(0, 0);
        Serial.println("Command timeout - motors stopped");
      }
    }
  }
}

void setupMotors() {
  // Configure all motor pins
  pinMode(LEFT_FRONT_IN1, OUTPUT);
  pinMode(LEFT_FRONT_IN2, OUTPUT);
  pinMode(LEFT_FRONT_ENA, OUTPUT); 
  pinMode(RIGHT_FRONT_IN3, OUTPUT);
  pinMode(RIGHT_FRONT_IN4, OUTPUT);
  pinMode(RIGHT_FRONT_ENB, OUTPUT);
  
  pinMode(LEFT_REAR_IN1, OUTPUT);
  pinMode(LEFT_REAR_IN2, OUTPUT);
  pinMode(LEFT_REAR_ENA, OUTPUT);
  pinMode(RIGHT_REAR_IN3, OUTPUT);
  pinMode(RIGHT_REAR_IN4, OUTPUT);
  pinMode(RIGHT_REAR_ENB, OUTPUT);
  
  // Configure PWM for motor speed control
  ledcSetup(PWM_CHANNEL_LF, PWM_FREQ, PWM_RESOLUTION);
  ledcSetup(PWM_CHANNEL_RF, PWM_FREQ, PWM_RESOLUTION);
  ledcSetup(PWM_CHANNEL_LR, PWM_FREQ, PWM_RESOLUTION);
  ledcSetup(PWM_CHANNEL_RR, PWM_FREQ, PWM_RESOLUTION);
  
  // Attach PWM channels to enable pins
  ledcAttachPin(LEFT_FRONT_ENA, PWM_CHANNEL_LF);
  ledcAttachPin(RIGHT_FRONT_ENB, PWM_CHANNEL_RF);
  ledcAttachPin(LEFT_REAR_ENA, PWM_CHANNEL_LR);
  ledcAttachPin(RIGHT_REAR_ENB, PWM_CHANNEL_RR);
  
  // Initialize with motors stopped
  moveRobot(0, 0);
}

void moveRobot(float speed, float turn) {
  // Constrain inputs
  speed = constrain(speed, -1.0, 1.0);
  turn = constrain(turn, -1.0, 1.0);
  
  // Calculate left and right motor speeds
  float leftSpeed = speed - turn;
  float rightSpeed = speed + turn;
  
  // Normalize if values exceed limits
  float maxSpeed = max(abs(leftSpeed), abs(rightSpeed));
  if (maxSpeed > 1.0) {
    leftSpeed /= maxSpeed;
    rightSpeed /= maxSpeed;
  }
  
  // Convert to PWM values (0-255)
  int leftPWM = abs(leftSpeed) * 255;
  int rightPWM = abs(rightSpeed) * 255;
  
  // Apply minimum power threshold for reliable motor operation
  if (leftPWM > 0 && leftPWM < 50) leftPWM = 50;
  if (rightPWM > 0 && rightPWM < 50) rightPWM = 50;
  
  // Set motor directions - LEFT SIDE
  if (leftSpeed > 0) {
    // Forward for left motors
    digitalWrite(LEFT_FRONT_IN1, LOW);
    digitalWrite(LEFT_FRONT_IN2, HIGH);
    digitalWrite(LEFT_REAR_IN1, LOW);
    digitalWrite(LEFT_REAR_IN2, HIGH);
  } 
  else if (leftSpeed < 0) {
    // Backward for left motors
    digitalWrite(LEFT_FRONT_IN1, HIGH);
    digitalWrite(LEFT_FRONT_IN2, LOW);
    digitalWrite(LEFT_REAR_IN1, HIGH);
    digitalWrite(LEFT_REAR_IN2, LOW);
  } 
  else {
    // Stop left motors
    digitalWrite(LEFT_FRONT_IN1, LOW);
    digitalWrite(LEFT_FRONT_IN2, LOW);
    digitalWrite(LEFT_REAR_IN1, LOW);
    digitalWrite(LEFT_REAR_IN2, LOW);
  }
  
  // Set motor directions - RIGHT SIDE
  if (rightSpeed > 0) {
    // Forward for right motors (using the corrected pin setup)
    digitalWrite(RIGHT_FRONT_IN3, LOW);
    digitalWrite(RIGHT_FRONT_IN4, HIGH);
    digitalWrite(RIGHT_REAR_IN3, LOW);
    digitalWrite(RIGHT_REAR_IN4, HIGH);
  } 
  else if (rightSpeed < 0) {
    // Backward for right motors
    digitalWrite(RIGHT_FRONT_IN3, HIGH);
    digitalWrite(RIGHT_FRONT_IN4, LOW);
    digitalWrite(RIGHT_REAR_IN3, HIGH);
    digitalWrite(RIGHT_REAR_IN4, LOW);
  } 
  else {
    // Stop right motors
    digitalWrite(RIGHT_FRONT_IN3, LOW);
    digitalWrite(RIGHT_FRONT_IN4, LOW);
    digitalWrite(RIGHT_REAR_IN3, LOW);
    digitalWrite(RIGHT_REAR_IN4, LOW);
  }
  
  // Set PWM values
  ledcWrite(PWM_CHANNEL_LF, leftPWM);
  ledcWrite(PWM_CHANNEL_RF, rightPWM);
  
  // Special handling for LEFT REAR motor with maximum power for backward
  if (leftSpeed < 0) {
    ledcWrite(PWM_CHANNEL_LR, 255); // Max power for backward
  } else {
    ledcWrite(PWM_CHANNEL_LR, leftPWM);
  }
  
  ledcWrite(PWM_CHANNEL_RR, rightPWM);
  
  // Debug output
  Serial.printf("Speed: %.2f, Turn: %.2f | Left: %.2f (%d), Right: %.2f (%d)\n", 
                speed, turn, leftSpeed, leftPWM, rightSpeed, rightPWM);
}

void onWebSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      // Stop motors when client disconnects
      moveRobot(0, 0);
      break;
      
    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connected from %d.%d.%d.%d\n", num, ip[0], ip[1], ip[2], ip[3]);
        // Send welcome message
        webSocket.sendTXT(num, "Connected to Crop Ally Robot");
      }
      break;
      
    case WStype_TEXT:
      {
        DynamicJsonDocument doc(256);
        DeserializationError error = deserializeJson(doc, payload, length);
        
        if (error) {
          Serial.printf("JSON parsing error: %s\n", error.c_str());
          return;
        }
        
        // Extract command parameters
        if (doc.containsKey("speed") && doc.containsKey("turn")) {
          float speed = doc["speed"];
          float turn = doc["turn"];
          
          currentSpeed = speed;
          turnFactor = turn;
          lastCommandTime = millis();
          
          // NEW: Handle hold command flag
          if (doc.containsKey("hold")) {
            holdLastCommand = doc["hold"];
          }
          
          moveRobot(speed, turn);
        }
        
        // Send response
        String response;
        DynamicJsonDocument responseDoc(256);
        responseDoc["speed"] = currentSpeed;
        responseDoc["turn"] = turnFactor;
        responseDoc["lastCommand"] = lastCommandTime;
        serializeJson(responseDoc, response);
        webSocket.sendTXT(num, response);
      }
      break;
  }
}