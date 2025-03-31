import React, { useState } from "react";
import {
  View,
  PanResponder,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";

interface SliderProps {
  minValue: number;
  maxValue: number;
  step: number;
  values: number[];
  onValuesChange: (values: number[]) => void;
}

const Slider = ({
  minValue,
  maxValue,
  step,
  values,
  onValuesChange,
}: SliderProps) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const thumbRadius = 12;
  const trackHeight = 4;

  // Create animated values for each thumb
  const thumbPositions = values.map(
    (value) =>
      new Animated.Value(
        ((value - minValue) / (maxValue - minValue)) * sliderWidth,
      ),
  );

  // Create pan responders for each thumb
  const panResponders = thumbPositions.map((position, index) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        let newPosition = gestureState.moveX - thumbRadius;

        // Constrain to slider bounds
        if (newPosition < 0) newPosition = 0;
        if (newPosition > sliderWidth) newPosition = sliderWidth;

        // Constrain to adjacent thumbs if multiple
        if (index > 0 && newPosition < thumbPositions[index - 1].__getValue())
          newPosition = thumbPositions[index - 1].__getValue();
        if (
          index < thumbPositions.length - 1 &&
          newPosition > thumbPositions[index + 1].__getValue()
        )
          newPosition = thumbPositions[index + 1].__getValue();

        // Snap to steps
        const valueRange = maxValue - minValue;
        const stepSize = sliderWidth / (valueRange / step);
        const steps = Math.round(newPosition / stepSize);
        newPosition = steps * stepSize;

        position.setValue(newPosition);

        // Calculate and report new values
        const newValues = [...values];
        newValues[index] =
          minValue + (newPosition / sliderWidth) * (maxValue - minValue);
        // Round to step
        newValues[index] = Math.round(newValues[index] / step) * step;
        onValuesChange(newValues);
      },
      onPanResponderRelease: () => {
        // Final update with exact values
        const newValues = thumbPositions.map(
          (pos) =>
            minValue + (pos.__getValue() / sliderWidth) * (maxValue - minValue),
        );
        // Round to step
        const roundedValues = newValues.map(
          (val) => Math.round(val / step) * step,
        );
        onValuesChange(roundedValues);
      },
    }),
  );

  // Update thumb positions when values change externally
  React.useEffect(() => {
    if (sliderWidth > 0) {
      values.forEach((value, index) => {
        const position =
          ((value - minValue) / (maxValue - minValue)) * sliderWidth;
        thumbPositions[index].setValue(position);
      });
    }
  }, [values, sliderWidth, minValue, maxValue]);

  const renderThumbs = () => {
    return thumbPositions.map((position, index) => (
      <Animated.View
        key={`thumb-${index}`}
        style={[
          styles.thumb,
          {
            transform: [{ translateX: position }],
            width: thumbRadius * 2,
            height: thumbRadius * 2,
            borderRadius: thumbRadius,
          },
        ]}
        {...panResponders[index].panHandlers}
      />
    ));
  };

  const renderRangeHighlight = () => {
    if (values.length === 2) {
      return (
        <Animated.View
          style={[
            styles.highlight,
            {
              left: thumbPositions[0],
              right: sliderWidth - thumbPositions[1].__getValue(),
              height: trackHeight,
            },
          ]}
        />
      );
    }
    return null;
  };

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setSliderWidth(width - thumbRadius * 2);
      }}
    >
      <View
        style={[
          styles.track,
          {
            height: trackHeight,
          },
        ]}
      />
      {renderRangeHighlight()}
      {renderThumbs()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 12, // To account for thumb radius
  },
  track: {
    backgroundColor: "#E0E0E0",
    width: "100%",
    borderRadius: 2,
  },
  highlight: {
    position: "absolute",
    backgroundColor: "#1DA1F2",
    borderRadius: 2,
  },
  thumb: {
    position: "absolute",
    backgroundColor: "#1DA1F2",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Slider;
