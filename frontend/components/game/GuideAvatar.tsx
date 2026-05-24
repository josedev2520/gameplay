import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { useGameStore } from '@/store/gameStore';

interface GuideAvatarProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function GuideAvatar({ message, size = 'md' }: GuideAvatarProps) {
  const storeMessage = useGameStore((s) => s.guideMessage);
  const displayMessage = message ?? storeMessage;

  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.08,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const avatarSize = size === 'sm' ? 48 : size === 'lg' ? 96 : 72;
  const fontSize = size === 'sm' ? 28 : size === 'lg' ? 52 : 40;

  return (
    <View className="items-center">
      <Animated.View
        style={{ transform: [{ translateY: bounceAnim }, { scale: scaleAnim }] }}>
        <View
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            backgroundColor: '#FEF3C7',
            borderWidth: 3,
            borderColor: '#F59E0B',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#F59E0B',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 6,
            elevation: 6,
          }}>
          <Text style={{ fontSize }}>{size === 'sm' ? '🦉' : '🦉'}</Text>
        </View>
      </Animated.View>

      {displayMessage ? (
        <View
          style={{
            marginTop: 8,
            backgroundColor: 'white',
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderWidth: 2,
            borderColor: '#F59E0B',
            maxWidth: 260,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
          <Text
            style={{
              fontSize: 13,
              color: '#374151',
              textAlign: 'center',
              fontWeight: '600',
              lineHeight: 18,
            }}>
            {displayMessage}
          </Text>
          {/* Speech bubble tail */}
          <View
            style={{
              position: 'absolute',
              top: -10,
              alignSelf: 'center',
              width: 0,
              height: 0,
              borderLeftWidth: 8,
              borderRightWidth: 8,
              borderBottomWidth: 10,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: '#F59E0B',
            }}
          />
        </View>
      ) : null}
    </View>
  );
}
