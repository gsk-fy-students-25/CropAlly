import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { ROBOT_PROFILES, RobotProfile } from '@/constants/robotProfiles'
import { useColorScheme } from '@/hooks/useColorScheme'
import { BlurView } from 'expo-blur'
import React from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

interface RobotProfileSelectorProps {
  selectedProfile: RobotProfile
  onProfileSelect: (profile: RobotProfile) => void
  visible: boolean
  onClose: () => void
}

export function RobotProfileSelector({ 
  selectedProfile, 
  onProfileSelect, 
  visible, 
  onClose 
}: RobotProfileSelectorProps) {
  const colorScheme = useColorScheme()
  
  if (!visible) return null

  const getProfileIcon = (type: RobotProfile['type']) => {
    switch (type) {
      case 'raspberry-pi':
        return 'cpu.fill'
      case 'esp32':
        return 'antenna.radiowaves.left.and.right'
      case 'custom':
        return 'gear'
      default:
        return 'questionmark.circle'
    }
  }

  return (
    <View className="absolute inset-0 z-50 flex-1 justify-center items-center bg-black/50">
      <BlurView 
        intensity={80} 
        className="w-11/12 max-w-md rounded-2xl overflow-hidden"
      >
        <ThemedView className="p-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <ThemedText className="text-xl font-bold">Select Robot Type</ThemedText>
            <TouchableOpacity onPress={onClose} className="p-2">
              <IconSymbol name="xmark" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>

          {/* Profile List */}
          <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
            {ROBOT_PROFILES.map((profile) => (
              <TouchableOpacity
                key={profile.id}
                onPress={() => {
                  onProfileSelect(profile)
                  onClose()
                }}
                className={`p-4 rounded-xl mb-3 border ${
                  selectedProfile.id === profile.id 
                    ? 'bg-blue-500/20 border-blue-500' 
                    : 'bg-gray-100/10 border-gray-300/30'
                }`}
              >
                <View className="flex-row items-center mb-2">
                  <IconSymbol 
                    name={getProfileIcon(profile.type)} 
                    size={24} 
                    color={selectedProfile.id === profile.id ? '#3b82f6' : (colorScheme === 'dark' ? '#fff' : '#000')}
                  />
                  <View className="ml-3 flex-1">
                    <ThemedText className="font-semibold text-base">{profile.name}</ThemedText>
                    <ThemedText className="text-sm opacity-70">Port: {profile.defaultPort}</ThemedText>
                  </View>
                  {selectedProfile.id === profile.id && (
                    <IconSymbol name="checkmark.circle.fill" size={20} color="#3b82f6" />
                  )}
                </View>
                
                <ThemedText className="text-sm opacity-60 mb-2">{profile.description}</ThemedText>
                
                {/* Features */}
                <View className="flex-row flex-wrap gap-1">
                  {Object.entries(profile.features).map(([feature, enabled]) => (
                    enabled && (
                      <View 
                        key={feature}
                        className="px-2 py-1 rounded-md bg-green-500/20"
                      >
                        <ThemedText className="text-xs text-green-600 dark:text-green-400 capitalize">
                          {feature}
                        </ThemedText>
                      </View>
                    )
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          <View className="mt-4 pt-4 border-t border-gray-300/30">
            <ThemedText className="text-xs opacity-60 text-center">
              Different robot types may have different capabilities and connection settings
            </ThemedText>
          </View>
        </ThemedView>
      </BlurView>
    </View>
  )
}
