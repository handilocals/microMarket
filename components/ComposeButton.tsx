import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { PenSquare } from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface ComposeButtonProps {
  size?: number;
  color?: string;
  onPress?: () => void;
}

const ComposeButton = ({
  size = 60,
  color = "#1DA1F2",
  onPress,
}: ComposeButtonProps) => {
  const router = useRouter();

  const handlePress = () => {
    // Provide haptic feedback when button is pressed
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Use custom onPress handler if provided, otherwise navigate to compose screen
    if (onPress) {
      onPress();
    } else {
      router.push("/compose");
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className="absolute bottom-16 right-4 z-10"
    >
      <View
        style={{ width: size, height: size }}
        className="rounded-full bg-primary-500 dark:bg-primary-600 flex items-center justify-center shadow-lg elevation-5"
      >
        <PenSquare size={24} color="white" />
      </View>
    </TouchableOpacity>
  );
};

export default ComposeButton;
