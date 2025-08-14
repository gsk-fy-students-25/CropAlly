import { useConnection } from '@/context/ConnectionContext';
import React, { forwardRef, useImperativeHandle } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface WebSocketAnimatedWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  pulseOnMessage?: boolean;
}

export interface WebSocketAnimatedWrapperRef {
  triggerPulse: () => void;
}

export const WebSocketAnimatedWrapper = forwardRef<
  WebSocketAnimatedWrapperRef,
  WebSocketAnimatedWrapperProps
>(({ children, style, pulseOnMessage = true }, ref) => {
  const { isConnected } = useConnection();
  const pulseAnim = useSharedValue(1);
  
  // Function to trigger pulse animation
  const triggerPulse = () => {
    if (pulseOnMessage && isConnected) {
      pulseAnim.value = withTiming(1.05, { duration: 100 }, () => {
        pulseAnim.value = withSpring(1, { damping: 15 });
      });
    }
  };
  
  useImperativeHandle(ref, () => ({
    triggerPulse
  }));
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));
  
  return (
    <View style={style}>
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
});