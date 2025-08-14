import { IconSymbol } from '@/components/ui/IconSymbol';
import { RobotProfile, getDefaultProfile } from '@/constants/robotProfiles';
import { useConnection } from '@/context/ConnectionContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RobotProfileSelector } from './RobotProfileSelector';

export const ConnectionForm = () => {
  const { connect, isConnected, serverAddress, setRobotProfile } = useConnection();
  const [address, setAddress] = useState(serverAddress || '172.20.10.8');
  const [connecting, setConnecting] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<RobotProfile>(getDefaultProfile());
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const colorScheme = useColorScheme();

  const handleConnect = async () => {
    setConnecting(true);
    try {
      // Update the robot profile in context
      setRobotProfile(selectedProfile);
      
      // Format address with selected profile's default port
      const formattedAddress = address.includes(':') 
        ? address 
        : `${address}:${selectedProfile.defaultPort}`;
      
      const success = await connect(formattedAddress, selectedProfile);
      if (success) {
        console.log(`✅ Connected to ${selectedProfile.name} at ${formattedAddress}`);
      }
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setConnecting(false);
    }
  };

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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect to Robot</Text>
      
      {/* Robot Profile Selector */}
      <TouchableOpacity 
        style={styles.profileSelector}
        onPress={() => setShowProfileSelector(true)}
      >
        <View style={styles.profileInfo}>
          <IconSymbol 
            name={getProfileIcon(selectedProfile.type)} 
            size={20} 
            color={colorScheme === 'dark' ? '#fff' : '#000'} 
          />
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{selectedProfile.name}</Text>
            <Text style={styles.profilePort}>Port: {selectedProfile.defaultPort}</Text>
          </View>
        </View>
        <IconSymbol name="chevron.right" size={16} color="#666" />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder={`IP address (e.g., 192.168.1.10)`}
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <Text style={styles.connectionInfo}>
        Will connect to: {address}:{selectedProfile.defaultPort}
      </Text>
      
      <Button
        title={connecting ? "Connecting..." : "Connect"}
        onPress={handleConnect}
        disabled={connecting || isConnected}
      />
      {isConnected && (
        <Text style={styles.successText}>
          Connected to {serverAddress}
        </Text>
      )}

      {/* Profile Selector Modal */}
      <RobotProfileSelector
        selectedProfile={selectedProfile}
        onProfileSelect={setSelectedProfile}
        visible={showProfileSelector}
        onClose={() => setShowProfileSelector(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  profileSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileText: {
    marginLeft: 8,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  profilePort: {
    fontSize: 12,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  connectionInfo: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  successText: {
    marginTop: 16,
    color: 'green',
    textAlign: 'center',
  },
});