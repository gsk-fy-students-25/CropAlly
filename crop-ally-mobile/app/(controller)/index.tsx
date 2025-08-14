import { useConnection } from "@/context/ConnectionContext"
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { BlurView } from "expo-blur"
import * as Haptics from 'expo-haptics'
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import * as ScreenOrientation from 'expo-screen-orientation'
import { StatusBar } from "expo-status-bar"
import { useEffect, useRef, useState } from "react"
import { Alert, Animated, Easing, FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native"
import ReAnimated, { FadeIn, FadeInDown, SlideInDown, ZoomIn } from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"

const IP_STORAGE_KEY = "RECENT_IPS";

export default function WelcomeScreen() {
  const { connect, isConnected, lastConnection, serverAddress } = useConnection()

  // Handle screen orientation
  useEffect(() => {
    const lockPortrait = async () => {
      try {
        const supportsOrientationLock = await ScreenOrientation.supportsOrientationLockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        if (supportsOrientationLock) {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        } else {
          console.log('Portrait orientation not supported on this device');
        }
      } catch (error) {
        console.error('Error handling orientation:', error);
      }
    };

    lockPortrait();

    return () => {
      ScreenOrientation.unlockAsync()
        .catch(error => console.error('Error unlocking orientation:', error));
    };
  }, []);
  const [ipAddress, setIpAddress] = useState(lastConnection?.address || "")
  const [recentIps, setRecentIps] = useState<string[]>([
    "172.20.10.3",  // Default local network IP
    "192.168.1.100",  // Alternative local network IP
    "10.0.0.100"     // Default private network IP
  ])
  const [availableIps, setAvailableIps] = useState<string[]>([
    "172.20.10.3",  // Default local network IP
    "192.168.1.100",  // Alternative local network IP
    "10.0.0.100"     // Default private network IP
  ])
  const [isConnecting, setIsConnecting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  
  // Animation values
  const robotFloatAnim = useRef(new Animated.Value(0)).current
  const robotRotateAnim = useRef(new Animated.Value(0)).current
  const glowAnim = useRef(new Animated.Value(0)).current
  
  useEffect(() => {
    loadRecentIps()
  }, [])
  
  const loadRecentIps = async () => {
    try {
      const savedIps = await AsyncStorage.getItem(IP_STORAGE_KEY);
      if (savedIps) {
        setRecentIps(JSON.parse(savedIps));
      }
    } catch (err) {
      console.error("Error loading IPs:", err);
    }
  };

  const saveIpToHistory = async (newIp: string) => {
    let updatedIps = [newIp, ...recentIps.filter((item) => item !== newIp)];
    if (updatedIps.length > 5) updatedIps = updatedIps.slice(0, 5);
    await AsyncStorage.setItem(IP_STORAGE_KEY, JSON.stringify(updatedIps));
    setRecentIps(updatedIps);
  };
  
  // Start animations
  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(robotFloatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        }),
        Animated.timing(robotFloatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        })
      ])
    ).start()
    
    // Subtle rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(robotRotateAnim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        }),
        Animated.timing(robotRotateAnim, {
          toValue: 0,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        })
      ])
    ).start()
    
    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false
        })
      ])
    ).start()
  }, [])
  
  const handleConnect = async () => {
    if (!ipAddress) return
    
    setErrorMessage("")
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setIsConnecting(true)
    
    try {
      await saveIpToHistory(ipAddress);
      const connectionSuccess = await connect(ipAddress)
      
      if (connectionSuccess) {
        router.replace("/control")
      } else {
        setErrorMessage("Connection failed. Please check the IP address and try again.")
        Alert.alert(
          "Connection Failed",
          "Could not connect to the robot. Please check:\n\n• The IP address is correct\n• The robot server is running\n• Your device is on the same network",
          [{ text: "OK", style: "default" }]
        )
      }
      setIsConnecting(false)
    } catch (error) {
      console.error("Connection error:", error)
      setErrorMessage("Failed to connect to robot. Please check the IP address.")
      
      Alert.alert(
        "Connection Failed",
        "Unable to connect to the robot. Please verify the connection details and try again.",
        [{ text: "OK", style: "default" }]
      )
      setIsConnecting(false)
    }
  }
  
  // Animation interpolations
  const robotYPosition = robotFloatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  })
  
  const robotRotation = robotRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3deg', '3deg']
  })
  
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.10, 0.1]  
  })
  
  // Theme colors
  const colors = {
    background: isDark ? '#000000' : '#ffffff',
    cardBackground: isDark ? 'rgba(18, 24, 18, 0.8)' : 'rgba(245, 250, 245, 0.8)',
    text: isDark ? '#ffffff' : '#1a1a1a',
    textSecondary: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    textMuted: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    primary: '#2dd36f', // Vibrant natural green
    primaryDark: '#20a757',
    primaryLight: '#4aea8b',
    primaryTransparent: isDark ? 'rgba(45, 211, 111, 0.15)' : 'rgba(45, 211, 111, 0.1)',
    inputBackground: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
  }
  
  // Gradient colors
  const gradientColors = isDark 
    ? ['rgba(0, 0, 0, 1)', 'rgba(10, 20, 10, 0.95)', 'rgba(5, 15, 5, 0.98)'] as const
    : ['rgba(255, 255, 255, 1)', 'rgba(245, 255, 245, 0.95)', 'rgba(250, 255, 250, 0.98)'] as const
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <LinearGradient 
        colors={gradientColors} 
        style={{ flex: 1 }} 
      >
        {/* Animated background elements */}
        <ReAnimated.View 
          entering={FadeIn.duration(1500)}
          style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.1 }}
        >
          <View style={{ 
            position: 'absolute', 
            height: 150, 
            width: 150, 
            borderRadius: 75, 
            backgroundColor: isDark ? 'rgba(45, 211, 111, 0.1)' : 'rgba(45, 211, 111, 0.05)', 
            top: 100, 
            right: 50,
            transform: [{ scale: 2 }],
            opacity: 0.3,
          }} />
          <View style={{ 
            position: 'absolute', 
            height: 120, 
            width: 120, 
            borderRadius: 60, 
            backgroundColor: isDark ? 'rgba(45, 211, 111, 0.08)' : 'rgba(45, 211, 111, 0.04)', 
            bottom: 150, 
            left: 50,
            transform: [{ scale: 2 }],
            opacity: 0.3,
          }} />
        </ReAnimated.View>
        
        {/* Header */}
        <ReAnimated.View 
          entering={FadeInDown.duration(800)}
          style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingHorizontal: 24, 
            paddingTop: 16 
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="robot" size={32} color={colors.primary} />
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold', marginLeft: 8 }}>
              Crop<Text style={{ color: colors.primary }}>Ally</Text>
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity 
              style={{ 
                marginRight: 16, 
                backgroundColor: colors.primaryTransparent, 
                padding: 10, 
                borderRadius: 20,
                borderWidth: 1,
                borderColor: colors.border
              }}
              onPress={() => router.push("/settings")}
            >
              <Feather name="settings" size={22} color={colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{ 
                backgroundColor: colors.primaryTransparent, 
                padding: 10, 
                borderRadius: 20,
                borderWidth: 1,
                borderColor: colors.border
              }}
              onPress={() => router.push("/help")}
            >
              <Feather name="help-circle" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </ReAnimated.View>
        
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ paddingBottom: 40 }} 
          showsVerticalScrollIndicator={false}
        >
          {/* Robot Model/Illustration Centerpiece */}
          <ReAnimated.View 
            entering={ZoomIn.delay(300).duration(1000)}
            style={{ alignItems: 'center', justifyContent: 'center', marginTop: 24, marginBottom: 32 }}
          >
            {/* Robot display section with status indicator underneath */}
            <View style={{ alignItems: 'center' }}>
              {/* Tech-inspired background pattern */}
              <View style={{ position: 'absolute', opacity: 0.4 }}>
                {/* Main pattern */}
                <LinearGradient
                  colors={[
                    'transparent',
                    isDark ? 'rgba(45, 211, 111, 0.08)' : 'rgba(45, 211, 111, 0.04)',
                    isDark ? 'rgba(45, 211, 111, 0.05)' : 'rgba(45, 211, 111, 0.02)',
                  ]}
                  style={{ 
                    width: 300, 
                    height: 300, 
                    position: 'absolute',
                    top: -15,
                    borderRadius: 150,
                  }}
                />
                
                {/* Circuit-like lines */}
                <View 
                  style={{ 
                    position: 'absolute', 
                    width: 280, 
                    height: 280, 
                    borderWidth: 1, 
                    borderColor: isDark ? 'rgba(45, 211, 111, 0.1)' : 'rgba(45, 211, 111, 0.05)', 
                    borderRadius: 140,
                    top: -5,
                  }} 
                />
                
                {/* Tech dots */}
                <View 
                  style={{ 
                    position: 'absolute', 
                    width: 8, 
                    height: 8, 
                    backgroundColor: colors.primary, 
                    opacity: 0.6, 
                    borderRadius: 4,
                    top: 40,
                    left: 50, 
                  }} 
                />
                <View 
                  style={{ 
                    position: 'absolute', 
                    width: 6, 
                    height: 6, 
                    backgroundColor: colors.primary, 
                    opacity: 0.5, 
                    borderRadius: 3,
                    top: 180,
                    right: 60, 
                  }} 
                />
                <View 
                  style={{ 
                    position: 'absolute', 
                    width: 4, 
                    height: 4, 
                    backgroundColor: colors.primary, 
                    opacity: 0.4, 
                    borderRadius: 2,
                    bottom: 30,
                    left: 80, 
                  }} 
                />
              </View>
              
              {/* Robot image with animations */}
              <Animated.View 
                style={{ 
                  transform: [
                    { translateY: robotYPosition },
                    { rotate: robotRotation }
                  ] 
                }}
              >
                <Image 
                  source={require('../../assets/robot-model.png')} 
                  style={{ 
                    height: 260,
                    width: 260,
                    resizeMode: 'contain',
                  }}
                />
              </Animated.View>
              
              {/* Status indicator - centered below the robot */}
              <ReAnimated.View 
                entering={FadeIn.delay(1200).duration(800)}
                style={{ 
                  marginTop: 16,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 2
                }}
              >
                <BlurView 
                  intensity={isDark ? 20 : 40} 
                  tint={isDark ? "dark" : "light"}
                  style={{ borderRadius: 12, overflow: 'hidden' }}
                >
                  <View style={{ 
                    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)', 
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    flexDirection: 'row', 
                    alignItems: 'center' 
                  }}>
                    <View style={{ 
                      height: 6,
                      width: 6,
                      borderRadius: 3, 
                      backgroundColor: colors.primary, 
                      marginRight: 6
                    }} />
                    <Text style={{ 
                      color: colors.primary, 
                      fontWeight: '600',
                      fontSize: 12
                    }}>
                      WebSocket Ready
                    </Text>
                  </View>
                </BlurView>
              </ReAnimated.View>
            </View>
          </ReAnimated.View>
          
          {/* Connection Card */}
          <ReAnimated.View 
            entering={SlideInDown.delay(500).duration(800)}
            style={{ marginHorizontal: 24, marginTop: 8 }}
          >
            <BlurView
              intensity={isDark ? 30 : 60}
              tint={isDark ? "dark" : "light"}
              style={{ 
                borderRadius: 24, 
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: colors.border
              }}
            >
              <LinearGradient
                colors={[
                  isDark ? 'rgba(45, 211, 111, 0.15)' : 'rgba(45, 211, 111, 0.05)', 
                  isDark ? 'rgba(45, 211, 111, 0.05)' : 'rgba(45, 211, 111, 0.02)'
                ]}
                style={{ borderRadius: 24 }}
              >
                <View style={{ 
                  padding: 20, 
                  backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.03)', 
                  borderBottomWidth: 1, 
                  borderBottomColor: colors.border 
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ 
                      height: 36, 
                      width: 36, 
                      backgroundColor: colors.primaryTransparent, 
                      borderRadius: 18, 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <Feather name="wifi" size={18} color={colors.primary} />
                    </View>
                    <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600', marginLeft: 12 }}>
                      Connect to Your Robot
                    </Text>
                  </View>
                </View>
                
                <View style={{ padding: 20 }}>
                  {/* Last connected robot info (if available) */}
                  {lastConnection && (
                    <ReAnimated.View 
                      entering={FadeIn.delay(900)}
                      style={{ 
                        marginBottom: 16, 
                        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)', 
                        padding: 12, 
                        borderRadius: 16, 
                        borderWidth: 1, 
                        borderColor: colors.border, 
                        flexDirection: 'row', 
                        alignItems: 'center' 
                      }}
                    >
                      <MaterialCommunityIcons 
                        name="connection" 
                        size={18} 
                        color={colors.primary} 
                      />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Last Connected</Text>
                        <Text style={{ color: colors.text, fontWeight: '500' }}>{lastConnection.name}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setIpAddress(lastConnection.address)}
                        style={{ 
                          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)', 
                          paddingHorizontal: 8, 
                          paddingVertical: 4, 
                          borderRadius: 8, 
                          borderWidth: 1, 
                          borderColor: colors.border 
                        }}
                      >
                        <Text style={{ color: colors.primary, fontSize: 12 }}>Use</Text>
                      </TouchableOpacity>
                    </ReAnimated.View>
                  )}
                  
                  {/* IP Input with icon */}
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 8, marginLeft: 4 }}>
                      Robot Address
                    </Text>
                    <View style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      backgroundColor: colors.inputBackground, 
                      borderRadius: 16, 
                      borderWidth: 1, 
                      borderColor: colors.border, 
                      paddingHorizontal: 12 
                    }}>
                      <Feather name="globe" size={20} color={colors.textMuted} />
                      <TextInput
                        value={ipAddress}
                        onChangeText={setIpAddress}
                        placeholder="Enter robot IP address"
                        placeholderTextColor={colors.textMuted}
                        style={{ 
                          flex: 1, 
                          color: colors.text, 
                          paddingHorizontal: 12, 
                          paddingVertical: 12,
                          fontSize: 16
                        }}
                        keyboardType="default"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                  </View>
                  
                  {/* Available IPs section */}
                    <View style={{ marginBottom: 25 }}>
                      <Text style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 8 }}>
                        Available Connections
                      </Text>
                      <View style={{ 
                        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)', 
                        borderRadius: 12, 
                        borderWidth: 1, 
                        borderColor: colors.border 
                      }}>
                        <FlatList
                          data={availableIps || recentIps}
                          keyExtractor={(item) => item}
                          scrollEnabled={false}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              style={{ 
                                padding: 12,
                                borderBottomWidth: 1,
                                borderBottomColor: colors.border,
                                flexDirection: 'row',
                                alignItems: 'center'
                              }}
                              onPress={() => {
                                setIpAddress(item);
                                Haptics.selectionAsync();
                              }}
                            >
                              <Feather 
                                name="clock" 
                                size={16} 
                                color={colors.textMuted} 
                                style={{ marginRight: 12 }}
                              />
                              <Text style={{ color: colors.text, flex: 1 }}>{item}</Text>
                              <Feather name="chevron-right" size={16} color={colors.textMuted} />
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    </View>
                  
                  {/* Error message */}
                  {errorMessage ? (
                    <View style={{ 
                      marginBottom: 16, 
                      backgroundColor: isDark ? 'rgba(220, 38, 38, 0.2)' : 'rgba(220, 38, 38, 0.1)', 
                      padding: 12, 
                      borderRadius: 12, 
                      borderWidth: 1, 
                      borderColor: 'rgba(220, 38, 38, 0.3)' 
                    }}>
                      <Text style={{ color: '#ef4444', fontSize: 14 }}>{errorMessage}</Text>
                    </View>
                  ) : null}
                  
                  {/* Connect button */}
                  <TouchableOpacity
                    onPress={handleConnect}
                    disabled={isConnecting || !ipAddress}
                    style={{ 
                      borderRadius: 16, 
                      paddingVertical: 16, 
                      alignItems: 'center',
                      backgroundColor: isConnecting || !ipAddress 
                        ? isDark ? 'rgba(45, 211, 111, 0.3)' : 'rgba(45, 211, 111, 0.2)'
                        : colors.primary,
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: isDark ? 0.3 : 0.2,
                      shadowRadius: 8,
                      elevation: 5
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {isConnecting ? (
                        <ReAnimated.View entering={FadeIn}>
                          <Feather name="loader" size={20} color="#ffffff" />
                        </ReAnimated.View>
                      ) : (
                        <Feather name="wifi" size={20} color="#ffffff" />
                      )}
                      <Text style={{ color: '#ffffff', fontWeight: '600', marginLeft: 8, fontSize: 16 }}>
                        {isConnecting ? "Connecting..." : "Connect to Robot"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </BlurView>
          </ReAnimated.View>
          
          {/* Quick Access */}
          <ReAnimated.View 
            entering={SlideInDown.delay(700).duration(800)}
            style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, marginTop: 24 }}
          >
            <TouchableOpacity 
              style={{ 
                flex: 1, 
                marginRight: 12, 
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.03)', 
                padding: 16, 
                borderRadius: 20, 
                borderWidth: 1, 
                borderColor: colors.border 
              }}
              onPress={() => router.push("/settings")}
            >
              <View style={{ alignItems: 'center' }}>
                <View style={{ 
                  backgroundColor: colors.primaryTransparent, 
                  padding: 12, 
                  borderRadius: 20, 
                  marginBottom: 8 
                }}>
                  <Feather name="sliders" size={20} color={colors.primary} />
                </View>
                <Text style={{ color: colors.text, fontWeight: '500' }}>Settings</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{ 
                flex: 1, 
                marginHorizontal: 12, 
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.03)', 
                padding: 16, 
                borderRadius: 20, 
                borderWidth: 1, 
                borderColor: colors.border 
              }}
              onPress={() => {/* Documentation link */}}
            >
              <View style={{ alignItems: 'center' }}>
                <View style={{ 
                  backgroundColor: isDark ? 'rgba(45, 211, 111, 0.15)' : 'rgba(45, 211, 111, 0.1)', 
                  padding: 12, 
                  borderRadius: 20, 
                  marginBottom: 8 
                }}>
                  <Feather name="file-text" size={20} color={colors.primary} />
                </View>
                <Text style={{ color: colors.text, fontWeight: '500' }}>Docs</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{ 
                flex: 1, 
                marginLeft: 12, 
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.03)', 
                padding: 16, 
                borderRadius: 20, 
                borderWidth: 1, 
                borderColor: colors.border 
              }}
              onPress={() => router.push("/help")}
            >
              <View style={{ alignItems: 'center' }}>
                <View style={{ 
                  backgroundColor: isDark ? 'rgba(45, 211, 111, 0.15)' : 'rgba(45, 211, 111, 0.1)', 
                  padding: 12, 
                  borderRadius: 20, 
                  marginBottom: 8 
                }}>
                  <Feather name="help-circle" size={20} color={colors.primary} />
                </View>
                <Text style={{ color: colors.text, fontWeight: '500' }}>Help</Text>
              </View>
            </TouchableOpacity>
          </ReAnimated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  )
}