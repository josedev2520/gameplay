import React, { useRef, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  label?: string;
}

export default function ProgressBar({
  current,
  total,
  color = '#8B5CF6',
  label,
}: ProgressBarProps) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const percent = total > 0 ? Math.min(current / total, 1) : 0;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percent,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  return (
    <View style={{ width: '100%', paddingHorizontal: 4 }}>
      {label && (
        <Text
          style={{ fontSize: 11, color: '#6B7280', fontWeight: '600', marginBottom: 4 }}>
          {label}
        </Text>
      )}
      <View
        style={{
          height: 14,
          backgroundColor: '#E5E7EB',
          borderRadius: 8,
          overflow: 'hidden',
          borderWidth: 1.5,
          borderColor: '#D1D5DB',
        }}>
        <Animated.View
          style={{
            height: '100%',
            backgroundColor: color,
            borderRadius: 8,
            width: widthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }}>
          {/* Shine effect */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: 8,
            }}
          />
        </Animated.View>
      </View>
      <Text
        style={{
          fontSize: 11,
          color: '#6B7280',
          textAlign: 'right',
          marginTop: 2,
          fontWeight: '600',
        }}>
        {current}/{total}
      </Text>
    </View>
  );
}
