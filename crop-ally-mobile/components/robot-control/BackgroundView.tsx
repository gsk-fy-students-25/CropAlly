import { FontAwesome5 } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useVideoPlayer, VideoView } from 'expo-video'
import { useEffect } from "react"
import { Dimensions, Text, View } from "react-native"

const { width, height } = Dimensions.get("window")

interface BackgroundViewProps {
  colors: {
    info: string;
  };
  videoMode: boolean;
}

export function BackgroundView({ colors, videoMode }: BackgroundViewProps) {
  // Create video player with the demo video
  const player = useVideoPlayer(require('../../assets/demo.mp4'), player => {
    player.loop = true;
    player.volume = 0;
    player.playbackRate = 1.0;
  });

  // Control playback based on videoMode prop with error handling
  useEffect(() => {
    const handlePlayback = async () => {
      try {
        if (videoMode && player) {
          try {
            await player.play();
          } catch (err) {
            console.log("Failed to play video:", err);
          }
        } else if (player) {
          try {
            await player.pause();
          } catch (err) {
            console.log("Failed to pause video:", err);
          }
        }
      } catch (error) {
        console.log("Error controlling video playback:", error);
      }
    };
    
    handlePlayback();
    
    // Cleanup function
    return () => {
      try {
        if (player) {
          try {
            player.pause();
          } catch (error) {
            console.log("Error during video player cleanup:", error);
          }
        }
      } catch (error) {
        console.log("Error during video player cleanup:", error);
      }
    };
  }, [videoMode, player]);

  return (
    <View className="absolute inset-0">
      <LinearGradient 
        colors={['rgba(15, 23, 42, 1)', 'rgba(21, 31, 50, 1)']} 
        className="flex-1"
      />
      
      {/* Video background using the demo video - only shown in video mode */}
      {videoMode && player ? (
        <View className="absolute inset-0 opacity-40">
          <VideoView 
            player={player}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        </View>
      ) : (
        // Remote control mode (no video) - show a stylized grid/map view
        <View className="absolute inset-0 flex items-center justify-center">
          <View className="h-3/4 w-3/4 border border-cyan-500/20 rounded-lg overflow-hidden">
            {/* Grid pattern for map */}
            <View className="absolute inset-0">
              {Array.from({ length: 30 }).map((_, i) => (
                <View key={`h-map-${i}`} className="w-full h-px bg-cyan-500/10" style={{ top: i * 20 }} />
              ))}
              {Array.from({ length: 30 }).map((_, i) => (
                <View key={`v-map-${i}`} className="h-full w-px bg-cyan-500/10" style={{ left: i * 20 }} />
              ))}
            </View>
            
            {/* Map indicators */}
            <View className="absolute top-5 left-5 bg-slate-900/80 px-3 py-2 rounded border border-white/10">
              <Text className="text-white/70 font-mono text-xs">MAP VIEW</Text>
              <Text className="text-cyan-400 font-mono text-xs">SECTOR 4-A</Text>
            </View>
            
            {/* Robot position on map */}
            <View className="absolute" style={{ top: '50%', left: '50%', marginLeft: -10, marginTop: -10 }}>
              <View className="h-5 w-5 rounded-full bg-green-400" />
              <View className="absolute h-12 w-12 rounded-full border border-green-400/50 top-[-14px] left-[-14px]" />
              <View className="absolute h-20 w-20 rounded-full border border-green-400/30 top-[-30px] left-[-30px]" />
            </View>
            
            {/* Path indicators */}
            <View className="absolute inset-0">
              <View className="w-1/2 h-0.5 bg-green-400/30 absolute top-1/2 left-0" />
              <View className="w-0.5 h-1/3 bg-green-400/30 absolute top-1/3 left-1/2" />
            </View>
          </View>
        </View>
      )}
      
      {/* Enhanced grid overlay with position markers - shown in both modes */}
      <View className="absolute inset-0">
        <View className="opacity-15">
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={`h-${i}`} className="w-full h-px bg-white" style={{ top: i * 40 }} />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <View key={`v-${i}`} className="h-full w-px bg-white" style={{ left: i * 40 }} />
          ))}
        </View>
        
        {/* Directional compass */}
        <View className="absolute top-4 right-4 bg-black/30 rounded-full p-2">
          <FontAwesome5 name="compass" size={24} color={colors.info} />
        </View>
        
        {/* Robot position indicator (simulated) */}
        <View className="absolute" style={{ top: height * 0.4, left: width * 0.5 }}>
          <View className="h-4 w-4 rounded-full bg-cyan-400" />
          <View className="absolute h-12 w-12 rounded-full border border-cyan-400/50 top-[-4] left-[-4]" />
          <View className="absolute h-20 w-20 rounded-full border border-cyan-400/20 top-[-8] left-[-8]" />
        </View>
      </View>
    </View>
  );
}