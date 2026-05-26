import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, TouchableOpacity, ImageBackground } from 'react-native';
import { useGameStore } from '@/store/gameStore';

export default function SplashScreen() {
  const setScreen = useGameStore((s) => s.setScreen);

  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const starAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(titleAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(subtitleAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(buttonAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(starAnim, { toValue: 360, duration: 8000, easing: Easing.linear, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -16, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const stars = ['⭐', '🌟', '✨', '⭐', '🌟', '✨', '⭐', '🌟'];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#1E1B4B',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
      {/* Animated background stars */}
      {stars.map((s, i) => (
        <Animated.Text
          key={i}
          style={{
            position: 'absolute',
            top: `${10 + i * 11}%`,
            left: `${5 + i * 11}%`,
            fontSize: 18 + (i % 3) * 8,
            opacity: 0.5,
            transform: [
              {
                rotate: starAnim.interpolate({
                  inputRange: [0, 360],
                  outputRange: [`${i * 45}deg`, `${i * 45 + 360}deg`],
                }),
              },
            ],
          }}>
          {s}
        </Animated.Text>
      ))}

      {/* Island illustration */}
      <Animated.View
        style={{
          transform: [{ translateY: floatAnim }],
          marginBottom: 8,
        }}>
        <Text style={{ fontSize: 96, textAlign: 'center' }}>🏝️</Text>
      </Animated.View>

      {/* Title */}
      <Animated.View
        style={{
          opacity: titleAnim,
          transform: [
            {
              translateY: titleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [40, 0],
              }),
            },
          ],
          alignItems: 'center',
          marginBottom: 8,
        }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: '900',
            color: '#FDE68A',
            textAlign: 'center',
            letterSpacing: 1,
            textShadow: '0px 2px 8px #F59E0B',
          }}>
          WordQuest
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#C4B5FD',
            textAlign: 'center',
            marginTop: 2,
          }}>
          ✨ The Magic English Island ✨
        </Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View
        style={{
          opacity: subtitleAnim,
          transform: [
            {
              translateY: subtitleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
          marginBottom: 32,
          paddingHorizontal: 32,
        }}>
        <Text
          style={{
            fontSize: 15,
            color: '#A5B4FC',
            textAlign: 'center',
            lineHeight: 22,
          }}>
          Learn English words through magical adventures! 🦉🌈🎉
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: '#818CF8',
            textAlign: 'center',
            marginTop: 6,
          }}>
          For young explorers aged 5–7 🧒👧
        </Text>
      </Animated.View>

      {/* CTA Button */}
      <Animated.View
        style={{
          opacity: buttonAnim,
          transform: [
            {
              scale: buttonAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
          gap: 12,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => setScreen('home')}
          activeOpacity={0.85}
          style={{
            backgroundColor: '#FBBF24',
            paddingHorizontal: 48,
            paddingVertical: 18,
            borderRadius: 32,
            boxShadow: '0px 6px 12px 0px #FBBF2499',
            borderWidth: 3,
            borderColor: '#F59E0B',
          }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '900',
              color: '#1E1B4B',
              letterSpacing: 1,
            }}>
            🚀 Let's Play!
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setScreen('teacher_panel')}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 10,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: '#818CF8',
          }}>
          <Text style={{ color: '#A5B4FC', fontSize: 14, fontWeight: '600' }}>
            👩‍🏫 Teacher Panel
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
