import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { VocabWord } from '@/store/gameStore';

interface VocabCardProps {
  word: VocabWord;
  onPress?: () => void;
  selected?: boolean;
  correct?: boolean;
  incorrect?: boolean;
  showWord?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function VocabCard({
  word,
  onPress,
  selected = false,
  correct = false,
  incorrect = false,
  showWord = true,
  size = 'md',
  disabled = false,
}: VocabCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const emojiSize = size === 'sm' ? 32 : size === 'lg' ? 64 : 48;
  const cardWidth = size === 'sm' ? 80 : size === 'lg' ? 140 : 110;
  const cardHeight = size === 'sm' ? 80 : size === 'lg' ? 140 : 110;

  useEffect(() => {
    if (correct) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.25, duration: 150, useNativeDriver: true }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 400, useNativeDriver: false }),
          Animated.timing(glowAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
        ]),
        { iterations: 3 }
      ).start();
    }

    if (incorrect) {
      Animated.sequence([
        Animated.timing(rotateAnim, { toValue: -8, duration: 80, useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: 8, duration: 80, useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: -8, duration: 80, useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
      ]).start();
    }
  }, [correct, incorrect]);

  const rotate = rotateAnim.interpolate({
    inputRange: [-8, 0, 8],
    outputRange: ['-8deg', '0deg', '8deg'],
  });

  let borderColor = word.color + '66';
  let bgColor = word.color + '22';
  if (correct) {
    borderColor = '#22C55E';
    bgColor = '#DCFCE7';
  } else if (incorrect) {
    borderColor = '#EF4444';
    bgColor = '#FEE2E2';
  } else if (selected) {
    borderColor = word.color;
    bgColor = word.color + '33';
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }, { rotate }],
          width: cardWidth,
          height: cardHeight,
          borderRadius: 20,
          backgroundColor: bgColor,
          borderWidth: 3,
          borderColor,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: word.color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
          gap: 6,
        }}>
        <Text style={{ fontSize: emojiSize }}>{word.emoji}</Text>
        {showWord && (
          <Text
            style={{
              fontSize: size === 'sm' ? 10 : size === 'lg' ? 16 : 13,
              fontWeight: '800',
              color: '#1F2937',
              textAlign: 'center',
            }}>
            {word.word}
          </Text>
        )}
        {correct && (
          <View
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: '#22C55E',
              borderRadius: 12,
              width: 24,
              height: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ fontSize: 14 }}>✓</Text>
          </View>
        )}
        {incorrect && (
          <View
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: '#EF4444',
              borderRadius: 12,
              width: 24,
              height: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ fontSize: 14, color: 'white' }}>✗</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}
