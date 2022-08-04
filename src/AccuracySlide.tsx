import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  LayoutRectangle,
  View,
} from "react-native";

const ACCURATE_CLOSE = 25;
const ACCURATE_GOOD = 10;

interface AccuracySlideProps {
  cents: number;
}

export default ({ cents }: AccuracySlideProps) => {
  const [viewLayout, setViewLayout] = useState<LayoutRectangle>();
  const transformation = useRef(new Animated.Value(1)).current;

  const isClose = cents > -ACCURATE_CLOSE && cents < ACCURATE_CLOSE;
  const isGood = cents > -ACCURATE_GOOD && cents < ACCURATE_GOOD;

  const windowWidth = Dimensions.get("window").width;

  useEffect(() => {
    let translation = 0;
    if (viewLayout) {
      translation = (windowWidth * Math.abs((cents + 49) % 100) / 100) -
        (viewLayout.height / 2);
    }
    Animated.timing(transformation, {
      toValue: translation,
      duration: 125,
      useNativeDriver: true,
    }).start();
  }, [cents, windowWidth, viewLayout]);

  const Target = ({ height }: { height: number }) => (
    <View
      style={{
        backgroundColor: isGood ? "rgba(0,100,0,.9)" : "rgba(0,0,0,.2)",
        borderRadius: height / 2,
        height: height,
        width: height,
      }}
    />
  );

  const Indicator = ({ height }: { height: number }) => (
    <Animated.View
      style={{
        backgroundColor: isGood
          ? "rgba(0,100,0,.9)"
          : isClose
          ? "rgba(100,100,0,.2)"
          : "rgba(100,0,0,.2)",
        borderRadius: height / 2,
        height: height,
        position: "absolute",
        top: 0,
        left: 0,
        transform: [{ translateX: transformation }],
        width: height,
      }}
    />
  );

  const onLayout = (event: LayoutChangeEvent) => {
    setViewLayout(event.nativeEvent.layout);
  };

  return (
    <View
      onLayout={onLayout}
      style={{
        alignItems: "center",
        position: "relative",
        height: "100%",
        width: "100%",
      }}
    >
      {viewLayout && (
        <>
          <Target height={viewLayout.height} />
          <Indicator height={viewLayout.height} />
        </>
      )}
    </View>
  );
};
