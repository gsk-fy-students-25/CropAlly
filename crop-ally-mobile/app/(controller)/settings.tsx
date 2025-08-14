import { useConnection } from "@/context/ConnectionContext"
import { Feather } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import * as Haptics from 'expo-haptics'
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { useState } from "react"
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native"
import ReAnimated, { FadeIn, FadeInDown, SlideInDown } from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"

export default function SettingsScreen() {
  const { connectionType, setConnectionType } = useConnection()
  const [autoConnect, setAutoConnect] = useState(false)
  const [videoQuality, setVideoQuality] = useState("medium")
  const [robotName, setRobotName] = useState("Field Unit 3")
  const [recordVideo, setRecordVideo] = useState(false)
  const [diagnosticMode, setDiagnosticMode] = useState(false)
  const [connectionTimeout, setConnectionTimeout] = useState("10")
  
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
  
  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    // Here you would save settings to storage
    router.back()
  }
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
            <Feather name="settings" size={24} color={colors.primary} />
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600', marginLeft: 8 }}>
              Settings
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={handleSave}
            style={{ 
              backgroundColor: colors.primary, 
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.3 : 0.2,
              shadowRadius: 4,
              elevation: 3
            }}
          >
            <Text style={{ color: '#ffffff', fontWeight: '600' }}>Save</Text>
          </TouchableOpacity>
        </ReAnimated.View>
        
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Connection Settings */}
          <ReAnimated.View entering={SlideInDown.delay(200).duration(800)}>
            <Text style={{ 
              color: colors.text, 
              fontSize: 18, 
              fontWeight: '600', 
              marginBottom: 16,
              marginLeft: 4
            }}>
              Connection
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
                <View style={{ 
                  padding: 16, 
                  borderBottomWidth: 1, 
                  borderBottomColor: colors.border 
                }}>
                  <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 8 }}>
                    Robot Name
                  </Text>
                  
                  <TextInput
                    value={robotName}
                    onChangeText={setRobotName}
                    style={{
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.border,
                      fontSize: 16
                    }}
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
                
                <View style={{ 
                  padding: 16, 
                  borderBottomWidth: 1, 
                  borderBottomColor: colors.border,
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: '600' }}>
                      Auto Connect
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>
                      Automatically connect to last robot on startup
                    </Text>
                  </View>
                  
                  <Switch
                    value={autoConnect}
                    onValueChange={setAutoConnect}
                    trackColor={{ false: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", true: colors.primaryTransparent }}
                    thumbColor={autoConnect ? colors.primary : isDark ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                  />
                </View>
                
                <View style={{ 
                  padding: 16, 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: '600' }}>
                      Protocol Type
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>
                      Using WebSocket for robot connection
                    </Text>
                  </View>
                  
                  <View style={{ 
                    backgroundColor: colors.primaryTransparent,
                    borderRadius: 12,
                    padding: 8,
                    borderWidth: 1,
                    borderColor: colors.border
                  }}>
                    <Text style={{ 
                      color: colors.primary,
                      fontWeight: '500',
                      textAlign: 'center'
                    }}>
                      WebSocket
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </BlurView>
          </ReAnimated.View>
          
          {/* Video Settings */}
          <ReAnimated.View entering={SlideInDown.delay(300).duration(800)}>
            <Text style={{ 
              color: colors.text, 
              fontSize: 18, 
              fontWeight: '600', 
              marginBottom: 16,
              marginLeft: 4
            }}>
              Video
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
                <View style={{ 
                  padding: 16, 
                  borderBottomWidth: 1, 
                  borderBottomColor: colors.border 
                }}>
                  <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 12 }}>
                    Video Quality
                  </Text>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {["low", "medium", "high"].map((quality) => (
                      <TouchableOpacity
                        key={quality}
                        onPress={() => setVideoQuality(quality)}
                        style={{ 
                          flex: 1,
                          marginHorizontal: 4,
                          alignItems: 'center',
                          paddingVertical: 8,
                          borderRadius: 12,
                          backgroundColor: videoQuality === quality 
                            ? colors.primaryTransparent 
                            : colors.inputBackground,
                          borderWidth: 1,
                          borderColor: videoQuality === quality 
                            ? colors.primary + '50' 
                            : colors.border,
                        }}
                      >
                        <Text style={{ 
                          color: videoQuality === quality ? colors.primary : colors.textMuted,
                          fontWeight: '500'
                        }}>
                          {quality.charAt(0).toUpperCase() + quality.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={{ 
                  padding: 16, 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: '600' }}>
                      Auto-Record
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>
                      Record video automatically when connected
                    </Text>
                  </View>
                  
                  <Switch
                    value={recordVideo}
                    onValueChange={setRecordVideo}
                    trackColor={{ false: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", true: colors.primaryTransparent }}
                    thumbColor={recordVideo ? colors.primary : isDark ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                  />
                </View>
              </LinearGradient>
            </BlurView>
          </ReAnimated.View>
          
          {/* Advanced Settings */}
          <ReAnimated.View entering={SlideInDown.delay(400).duration(800)}>
            <Text style={{ 
              color: colors.text, 
              fontSize: 18, 
              fontWeight: '600', 
              marginBottom: 16,
              marginLeft: 4
            }}>
              Advanced
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
                <View style={{ 
                  padding: 16, 
                  borderBottomWidth: 1, 
                  borderBottomColor: colors.border,
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: '600' }}>
                      Connection Timeout
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>
                      Maximum wait time for connection attempts
                    </Text>
                  </View>
                  
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    backgroundColor: colors.inputBackground,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderWidth: 1,
                    borderColor: colors.border
                  }}>
                    <TextInput
                      value={connectionTimeout}
                      onChangeText={setConnectionTimeout}
                      keyboardType="number-pad"
                      style={{ 
                        color: colors.text, 
                        textAlign: 'right',
                        width: 40,
                        fontSize: 16
                      }}
                    />
                    <Text style={{ color: colors.textSecondary, marginLeft: 4 }}>sec</Text>
                  </View>
                </View>
                
                <View style={{ 
                  padding: 16, 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: '600' }}>
                      Diagnostic Mode
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>
                      Enable advanced logging and diagnostics
                    </Text>
                  </View>
                  
                  <Switch
                    value={diagnosticMode}
                    onValueChange={setDiagnosticMode}
                    trackColor={{ false: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", true: colors.primaryTransparent }}
                    thumbColor={diagnosticMode ? colors.primary : isDark ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                  />
                </View>
              </LinearGradient>
            </BlurView>
          </ReAnimated.View>
          
          {/* Version info */}
          <ReAnimated.View 
            entering={FadeIn.delay(500).duration(1000)}
            style={{ 
              alignItems: 'center',
              marginTop: 8,
              marginBottom: 16
            }}
          >
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              CropAlly Control v1.0.0
            </Text>
          </ReAnimated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  )
}