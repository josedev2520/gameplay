import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import { useGameStore, CATEGORY_LABELS, VOCABULARY } from '@/store/gameStore';

const CONFETTI_EMOJIS = ['🎉', '⭐', '🌟', '🎊', '🎈', '✨', '🏆', '🎯', '🦋', '🌈'];
const LEVEL_MESSAGES: Record<number, string> = {
  2: "You're a great Explorer! 🧭 Level 2 awaits!",
  3: "Amazing Speaker! 🎤 Now let's match words!",
  4: "Word Detective! 🔍 Build a sentence next!",
  5: "Sentence Builder! 🏗️ Final mission time!",
  1: "CHAMPION! 🏆 You completed ALL levels!",
};

export default function CelebrationScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const activeCategory = useGameStore((s) => s.activeCategory);
  const points = useGameStore((s) => s.points);
  const badges = useGameStore((s) => s.badges);
  const mode = useGameStore((s) => s.mode);

  const confettiAnims = useRef(
    CONFETTI_EMOJIS.map(() => ({
      y: new Animated.Value(-60),
      x: new Animated.Value(Math.random() * 300 - 150),
      opacity: new Animated.Value(0),
      rotate: new Animated.Value(0),
    }))
  ).current;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scale in main card
    Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();

    // Bounce trophy
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -16, duration: 500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    // Glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 600, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 600, useNativeDriver: false }),
      ])
    ).start();

    // Confetti falling
    confettiAnims.forEach((anim, i) => {
      const delay = i * 150;
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim.y, {
              toValue: 700,
              duration: 2500 + Math.random() * 1000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.delay(2000),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim.rotate, {
              toValue: 720,
              duration: 2500,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start(() => {
        anim.y.setValue(-60);
      });
    });
  }, []);

  const completedLevel = currentLevel - 1 === 0 ? 5 : currentLevel - 1;
  const isAllDone = currentLevel === 1;
  const words = VOCABULARY[activeCategory];
  const unlockedBadges = badges.filter((b) => b.unlocked);

  const handleNext = () => {
    if (isAllDone) {
      useGameStore.getState().setScreen('home');
    } else {
      useGameStore.getState().setScreen('level_intro');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1E1B4B', overflow: 'hidden' }}>
      {/* Confetti */}
      {confettiAnims.map((anim, i) => (
        <Animated.Text
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: `${10 + (i * 8) % 80}%`,
            fontSize: 24,
            transform: [
              { translateY: anim.y },
              { translateX: anim.x },
              {
                rotate: anim.rotate.interpolate({
                  inputRange: [0, 720],
                  outputRange: ['0deg', '720deg'],
                }),
              },
            ],
            opacity: anim.opacity,
          }}>
          {CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length]}
        </Animated.Text>
      ))}

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          paddingVertical: 40,
          paddingHorizontal: 20,
        }}>
        {/* Trophy */}
        <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
          <Text style={{ fontSize: 80, textAlign: 'center' }}>
            {isAllDone ? '🏆' : '⭐'}
          </Text>
        </Animated.View>

        {/* Main card */}
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            backgroundColor: 'white',
            borderRadius: 28,
            padding: 28,
            width: '100%',
            alignItems: 'center',
            marginTop: 16,
            borderWidth: 4,
            borderColor: '#FBBF24',
            shadowColor: '#FBBF24',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 12,
          }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '900',
              color: '#1F2937',
              textAlign: 'center',
              marginBottom: 8,
            }}>
            {isAllDone ? '🎊 All Levels Done! 🎊' : `Level ${completedLevel} Complete!`}
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: '#4B5563',
              textAlign: 'center',
              lineHeight: 22,
              marginBottom: 16,
            }}>
            {LEVEL_MESSAGES[currentLevel] ?? LEVEL_MESSAGES[1]}
          </Text>

          {/* Score */}
          <View
            style={{
              backgroundColor: '#FEF3C7',
              borderRadius: 16,
              paddingHorizontal: 24,
              paddingVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
              borderWidth: 2,
              borderColor: '#F59E0B',
            }}>
            <Text style={{ fontSize: 28 }}>⭐</Text>
            <Text style={{ fontSize: 28, fontWeight: '900', color: '#D97706' }}>
              {points} Points!
            </Text>
          </View>

          {/* Words learned */}
          <View style={{ width: '100%', marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: '#6B7280',
                marginBottom: 8,
                textAlign: 'center',
              }}>
              Words you learned today 📖
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                justifyContent: 'center',
              }}>
              {words.map((w) => (
                <View
                  key={w.id}
                  style={{
                    backgroundColor: w.color + '22',
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderWidth: 2,
                    borderColor: w.color + '66',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                  <Text style={{ fontSize: 18 }}>{w.emoji}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#374151' }}>
                    {w.word}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Badges earned */}
          {unlockedBadges.length > 0 && (
            <View style={{ width: '100%', marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: '#6B7280',
                  marginBottom: 8,
                  textAlign: 'center',
                }}>
                🏅 Badges Earned
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {unlockedBadges.map((badge) => (
                  <View
                    key={badge.id}
                    style={{
                      backgroundColor: '#FEF3C7',
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      alignItems: 'center',
                      borderWidth: 2,
                      borderColor: '#F59E0B',
                      minWidth: 70,
                    }}>
                    <Text style={{ fontSize: 22 }}>{badge.emoji}</Text>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#D97706', marginTop: 2 }}>
                      {badge.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Mini song */}
          <View
            style={{
              backgroundColor: '#F0F9FF',
              borderRadius: 16,
              padding: 14,
              width: '100%',
              borderWidth: 2,
              borderColor: '#BAE6FD',
              marginBottom: 16,
            }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#0284C7', textAlign: 'center', marginBottom: 6 }}>
              🎵 Sing along!
            </Text>
            {words.slice(0, 3).map((w) => (
              <Text key={w.id} style={{ fontSize: 13, color: '#374151', textAlign: 'center', lineHeight: 22 }}>
                {w.emoji} "{w.word}" — say it loud, say it proud!
              </Text>
            ))}
          </View>

          {/* Cooperative turn indicator */}
          {mode === 'cooperative' && (
            <View
              style={{
                backgroundColor: '#DCFCE7',
                borderRadius: 14,
                padding: 12,
                width: '100%',
                borderWidth: 2,
                borderColor: '#22C55E',
                marginBottom: 16,
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#15803D', textAlign: 'center' }}>
                👫 Pass the device to your teammate for the next level!
              </Text>
            </View>
          )}

          {/* Next button */}
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.85}
            style={{
              backgroundColor: '#FBBF24',
              paddingHorizontal: 40,
              paddingVertical: 16,
              borderRadius: 28,
              shadowColor: '#FBBF24',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.5,
              shadowRadius: 10,
              elevation: 8,
              marginBottom: 8,
              borderWidth: 3,
              borderColor: '#F59E0B',
            }}>
            <Text style={{ color: '#1E1B4B', fontWeight: '900', fontSize: 18 }}>
              {isAllDone ? '🏠 Back to Island' : `🚀 Level ${currentLevel}!`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setScreen('home')}>
            <Text style={{ color: '#9CA3AF', fontSize: 13, marginTop: 6 }}>
              Choose another station
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
