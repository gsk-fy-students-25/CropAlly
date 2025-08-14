import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import * as Haptics from 'expo-haptics'
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Text, TouchableOpacity, ScrollView, View, useColorScheme } from "react-native"
import ReAnimated, { FadeIn, FadeInDown, SlideInDown } from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"

export default function HelpScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  
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
        {/* Header */}
        <ReAnimated.View 
          entering={FadeInDown.duration(800)}
          style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingHorizontal: 24, 
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border
          }}
        >
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={{ 
              backgroundColor: colors.primaryTransparent, 
              padding: 10, 
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.border
            }}
          >
            <Feather name="arrow-left" size={22} color={colors.primary} />
          </TouchableOpacity>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="help-circle" size={24} color={colors.primary} />
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600', marginLeft: 8 }}>
              Help & Support
            </Text>
          </View>
          
          <View style={{ width: 42 }} />
        </ReAnimated.View>
        
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Getting Started */}
          <ReAnimated.View entering={SlideInDown.delay(200).duration(800)}>
            <Text style={{ 
              color: colors.text, 
              fontSize: 18, 
              fontWeight: '600', 
              marginBottom: 16,
              marginLeft: 4
            }}>
              Getting Started
            </Text>
            
            <BlurView
              intensity={isDark ? 30 : 60}
              tint={isDark ? "dark" : "light"}
              style={{ 
                borderRadius: 20, 
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 24
              }}
            >
              <LinearGradient
                colors={[
                  isDark ? 'rgba(45, 211, 111, 0.15)' : 'rgba(45, 211, 111, 0.05)', 
                  isDark ? 'rgba(45, 211, 111, 0.05)' : 'rgba(45, 211, 111, 0.02)'
                ]}
                style={{ borderRadius: 20, padding: 16 }}
              >
                <Text style={{ color: colors.text }}>
                  Welcome to CropAlly Control System. This app allows you to control and monitor 
                  your agricultural robot remotely.
                </Text>
                
                <Text style={{ color: colors.text, marginTop: 12 }}>
                  To begin, connect to your robot using its IP address on the welcome screen.
                  Once connected, you'll be taken to the control interface.
                </Text>
              </LinearGradient>
            </BlurView>
          </ReAnimated.View>
          
          {/* Control Interface */}
          <ReAnimated.View entering={SlideInDown.delay(300).duration(800)}>
            <Text style={{ 
              color: colors.text, 
              fontSize: 18, 
              fontWeight: '600', 
              marginBottom: 16,
              marginLeft: 4
            }}>
              Control Interface
            </Text>
            
            <BlurView
              intensity={isDark ? 30 : 60}
              tint={isDark ? "dark" : "light"}
              style={{ 
                borderRadius: 20, 
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 24
              }}
            >
              <LinearGradient
                colors={[
                  isDark ? 'rgba(45, 211, 111, 0.15)' : 'rgba(45, 211, 111, 0.05)', 
                  isDark ? 'rgba(45, 211, 111, 0.05)' : 'rgba(45, 211, 111, 0.02)'
                ]}
                style={{ borderRadius: 20 }}
              >
                <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ 
                      height: 24, 
                      width: 24, 
                      backgroundColor: colors.primaryTransparent, 
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                      marginTop: 2
                    }}>
                      <Feather name="move" size={14} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.text, fontWeight: '600' }}>Joystick Control</Text>
                      <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
                        Use the joystick to manually control robot movement.
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ 
                      height: 24, 
                      width: 24, 
                      backgroundColor: colors.primaryTransparent, 
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                      marginTop: 2
                    }}>
                      <Feather name="radio" size={14} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.text, fontWeight: '600' }}>Remote Mode</Text>
                      <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
                        Switch to remote mode for precision control with additional tools.
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ 
                      height: 24, 
                      width: 24, 
                      backgroundColor: colors.primaryTransparent, 
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                      marginTop: 2
                    }}>
                      <Feather name="video" size={14} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.text, fontWeight: '600' }}>Video Feed</Text>
                      <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
                        View live video from the robot's camera and record footage.
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={{ padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ 
                      height: 24, 
                      width: 24, 
                      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)', 
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                      marginTop: 2
                    }}>
                      <Feather name="alert-octagon" size={14} color="#ef4444" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.text, fontWeight: '600' }}>Emergency Stop</Text>
                      <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
                        Use the STOP button to immediately halt all robot activity.
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </BlurView>
          </ReAnimated.View>
          
          {/* Troubleshooting */}
          <ReAnimated.View entering={SlideInDown.delay(400).duration(800)}>
            <Text style={{ 
              color: colors.text, 
              fontSize: 18, 
              fontWeight: '600', 
              marginBottom: 16,
              marginLeft: 4
            }}>
              Troubleshooting
            </Text>
            
            <BlurView
              intensity={isDark ? 30 : 60}
              tint={isDark ? "dark" : "light"}
              style={{ 
                borderRadius: 20, 
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 24
              }}
            >
              <LinearGradient
                colors={[
                  isDark ? 'rgba(45, 211, 111, 0.15)' : 'rgba(45, 211, 111, 0.05)', 
                  isDark ? 'rgba(45, 211, 111, 0.05)' : 'rgba(45, 211, 111, 0.02)'
                ]}
                style={{ borderRadius: 20 }}
              >
                <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ 
                      height: 24, 
                      width: 24, 
                      backgroundColor: colors.primaryTransparent, 
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                      marginTop: 2
                    }}>
                      <Feather name="wifi-off" size={14} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.text, fontWeight: '600' }}>Connection Issues</Text>
                      <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
                        If you can't connect to the robot, check that both devices are on the same network.
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={{ padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ 
                      height: 24, 
                      width: 24, 
                      backgroundColor: colors.primaryTransparent, 
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                      marginTop: 2
                    }}>
                      <MaterialCommunityIcons name="video-wireless-outline" size={14} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.text, fontWeight: '600' }}>Video Feed Problems</Text>
                      <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
                        If the video feed is laggy, try lowering the video quality in settings.
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </BlurView>
          </ReAnimated.View>
          
          {/* Contact Support */}
          <ReAnimated.View entering={SlideInDown.delay(500).duration(800)}>
            <Text style={{ 
              color: colors.text, 
              fontSize: 18, 
              fontWeight: '600', 
              marginBottom: 16,
              marginLeft: 4
            }}>
              Contact Support
            </Text>
            
            <BlurView
              intensity={isDark ? 30 : 60}
              tint={isDark ? "dark" : "light"}
              style={{ 
                borderRadius: 20, 
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 24
              }}
            >
              <LinearGradient
                colors={[
                  isDark ? 'rgba(45, 211, 111, 0.15)' : 'rgba(45, 211, 111, 0.05)', 
                  isDark ? 'rgba(45, 211, 111, 0.05)' : 'rgba(45, 211, 111, 0.02)'
                ]}
                style={{ borderRadius: 20, padding: 16 }}
              >
                <Text style={{ color: colors.text }}>
                  Need further assistance? Contact our support team:
                </Text>
                <Text style={{ color: colors.primary, marginTop: 8, fontWeight: '500' }}>
                  support@cropally.com
                </Text>
                
                <TouchableOpacity 
                  style={{ 
                    backgroundColor: colors.primary,
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: 'center',
                    marginTop: 16,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isDark ? 0.3 : 0.2,
                    shadowRadius: 4,
                    elevation: 3
                  }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  }}
                >
                  <Text style={{ color: '#ffffff', fontWeight: '600' }}>
                    Send Support Request
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </BlurView>
          </ReAnimated.View>
          
          {/* Version info */}
          <ReAnimated.View 
            entering={FadeIn.delay(600).duration(1000)}
            style={{ 
              alignItems: 'center',
              marginTop: 8,
              marginBottom: 16
            }}
          >
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              CropAlly Help Guide v1.0.0
            </Text>
          </ReAnimated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  )
}