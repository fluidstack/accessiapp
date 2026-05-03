import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { useAccessibility } from "@/lib/accessibility";

const LOGO = require("../assets/images/splash-logo.png");
const SPLASH_BG = "#0b1020";

type Props = {
  onFinish: () => void;
};

export function AnimatedSplash({ onFinish }: Props) {
  const { reduceMotion: reducedMotion } = useAccessibility();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(reducedMotion ? 1 : 0.85);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion) {
      opacity.value = 1;
      scale.value = 1;
      containerOpacity.value = withDelay(
        700,
        withTiming(0, { duration: 300 }, (finished) => {
          if (finished) runOnJS(onFinish)();
        }),
      );
      return;
    }
    opacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    scale.value = withTiming(1, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
    containerOpacity.value = withDelay(
      1300,
      withTiming(0, { duration: 450, easing: Easing.in(Easing.quad) }, (done) => {
        if (done) runOnJS(onFinish)();
      }),
    );
  }, [reducedMotion, opacity, scale, containerOpacity, onFinish]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.container, containerStyle]}
    >
      <View style={styles.center}>
        <Animated.View style={logoStyle}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: SPLASH_BG, zIndex: 9999 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  logo: { width: 280, height: 80 },
});
