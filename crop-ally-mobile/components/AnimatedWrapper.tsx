import React, { useEffect } from 'react';
import {
    Platform,
    StyleSheet,
    UIManager,
    View,
    ViewStyle
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AnimatedWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  animateOnMount?: boolean;
  animationType?: 'fade' | 'scale' | 'slide';
}

export const AnimatedWrapper = ({ 
  children, 
  style, 
  animateOnMount = true,
  animationType = 'fade'
}: AnimatedWrapperProps) => {
  // Use Reanimated shared values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const translateY = useSharedValue(20);
  
  useEffect(() => {
    if (animateOnMount) {
      // Start animations using Reanimated
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 15 });
      translateY.value = withTiming(0, { duration: 300 });
    }
  }, [animateOnMount]);
  
  // Different animation styles based on animationType
  const animatedStyle = useAnimatedStyle(() => {
    switch (animationType) {
      case 'scale':
        return {
          opacity: opacity.value,
          transform: [{ scale: scale.value }],
        };
      case 'slide':
        return {
          opacity: opacity.value,
          transform: [{ translateY: translateY.value }],
        };
      default: // 'fade'
        return {
          opacity: opacity.value,
        };
    }
  });
  
  return (
    <View style={[style, styles.outerContainer]}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});