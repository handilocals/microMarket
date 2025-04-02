import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
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
      style={styles.buttonContainer}
    >
      <View
        style={[
          styles.button,
          { width: size, height: size, backgroundColor: color },
        ]}
      >
        <PenSquare size={24} color="white" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    right: 16,
    zIndex: 10,
  },
  button: {
    borderRadius: 30,
    backgroundColor: "#0EA5E9",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ComposeButton;
