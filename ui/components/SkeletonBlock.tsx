import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS } from '@/constants/GlobalStyles';

type Props = {
  width?: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export default function SkeletonBlock({ width, height, borderRadius = BORDER_RADIUS.md, style }: Props) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        { width: width ?? '100%', height, borderRadius, backgroundColor: COLORS.borderDark, opacity },
        style,
      ]}
    />
  );
}
