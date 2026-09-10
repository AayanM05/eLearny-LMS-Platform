import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

export interface HeadingProps extends TextProps {
  level?: 1 | 2 | 3 | 4;
}

export default function Heading({ level = 1, style, children, ...props }: HeadingProps) {
  const levelStyles = [
    styles.h1,
    level === 1 && styles.h1,
    level === 2 && styles.h2,
    level === 3 && styles.h3,
    level === 4 && styles.h4,
    style,
  ];

  return (
    <Text style={levelStyles} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 24 },
  h2: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 20 },
  h3: { fontFamily: 'SpaceGrotesk_700Bold', fontSize: 18 },
  h4: { fontFamily: 'SpaceGrotesk_600SemiBold', fontSize: 16 },
});
