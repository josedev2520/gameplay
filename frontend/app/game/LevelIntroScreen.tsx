import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useGameStore, CATEGORY_LABELS, VOCABULARY, CATEGORY_BG, Category } from '@/store/gameStore';
import GuideAvatar from '@/components/game/GuideAvatar';

const LEVEL_INFO = [
  {
    level: 1,
    title: 'Recognize & Point! 👆',
    description: 'See the object and tap the right one when you hear its name!',
    icon: '👀',
    color: '#22C55E',
    bg: '#DCFCE7',
    badge: 'explorer',
  },
  {
    level: 2,
    title: 'Repeat & Speak! 🎤',
    description: 'Listen to the word and try to say it out loud — be a brave speaker!',
    icon: '🎤',
    color: '#3B82F6',
    bg: '#DBEAFE',
    badge: 'speaker',
  },
  {
    level: 3,
    title: 'Match It! 🔗',
    description: 'Connect the object with its English word — you\'re a word detective!',
    icon: '🔗',
    color: '#F97316',
    bg: '#FFF7ED',
    badge: 'matcher',
  },
  {
    level: 4,
    title: 'Build a Sentence! 🏗️',
    description: 'Put the words in the right order to make a sentence in English!',
    icon: '💬',
    color: '#8B5CF6',
    bg: '#F3E8FF',
    badge: 'builder',
  },
  {
    level: 5,
    title: 'Mission Complete! 🦸',
    description: 'Solve the mission using everything you learned — be the hero!',
    icon: '🎯',
    color: '#EF4444',
    bg: '#FEE2E2',
    badge: 'hero',
  },
];

const GUIDE_MESSAGES: Record<number, string> = {
  1: "Look carefully! 👀 Tap the right picture when you hear the word!",
  2: "You're a star speaker! 🎤 Listen and say the word out loud!",
  3: "Detective time! 🔍 Match the word with the right picture!",
  4: "Word builder activate! 🏗️ Put the sentence together!",
  5: "MISSION TIME! 🦸 Use all your words to save the day!",
};

export default function LevelIntroScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const activeCategory = useGameStore((s) => s.activeCategory);
  const setGuideMessage = useGameStore((s) => s.setGuideMessage);
  const resetSession = useGameStore((s) => s.resetSession);

  const info = LEVEL_INFO[currentLevel - 1] ?? LEVEL_INFO[0];
  const words = VOCABULARY[activeCategory];

  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setGuideMessage(GUIDE_MESSAGES[currentLevel]);
    resetSession();
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [currentLevel]);

  const handleStart = () => {
    const screenMap: Record<number, any> = {
      1: 'level1',
      2: 'level2',
      3: 'level3',
      4: 'level4',
      5: 'level5',
    };
    setScreen(screenMap[currentLevel] ?? 'level1');
  };

  const handleLevelSelect = (l: number) => {
    const setLevel = useGameStore.getState().setLevel;
    setLevel(l);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: info.bg,
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20,
      }}>
      {/* Back */}
      <TouchableOpacity
        onPress={() => setScreen('home')}
        style={{ alignSelf: 'flex-start', marginBottom: 12 }}>
        <Text style={{ color: '#6B7280', fontSize: 14, fontWeight: '600' }}>⬅️ Back</Text>
      </TouchableOpacity>

      {/* Category badge */}
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 14,
          paddingHorizontal: 20,
          paddingVertical: 8,
          borderWidth: 2,
          borderColor: info.color,
          marginBottom: 16,
        }}>
        <Text style={{ fontWeight: '800', color: info.color, fontSize: 15 }}>
          {CATEGORY_LABELS[activeCategory]}
        </Text>
      </View>

      {/* Guide Avatar */}
      <GuideAvatar size="md" />

      {/* Level Card */}
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
          backgroundColor: 'white',
          borderRadius: 28,
          padding: 24,
          width: '100%',
          alignItems: 'center',
          marginTop: 24,
          borderWidth: 3,
          borderColor: info.color,
          boxShadow: `0px 8px 16px 0px ${info.color}40`,
        }}>
        <Text style={{ fontSize: 60 }}>{info.icon}</Text>
        <View
          style={{
            backgroundColor: info.color,
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 6,
            marginTop: 8,
            marginBottom: 12,
          }}>
          <Text style={{ color: 'white', fontWeight: '900', fontSize: 14 }}>
            Level {currentLevel} of 5
          </Text>
        </View>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '900',
            color: '#1F2937',
            textAlign: 'center',
            marginBottom: 10,
          }}>
          {info.title}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: '#4B5563',
            textAlign: 'center',
            lineHeight: 22,
            marginBottom: 20,
          }}>
          {info.description}
        </Text>

        {/* Vocabulary preview */}
        <View
          style={{
            backgroundColor: '#F9FAFB',
            borderRadius: 16,
            padding: 12,
            width: '100%',
            marginBottom: 20,
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: '#6B7280',
              marginBottom: 8,
              textAlign: 'center',
            }}>
            Today's Words 📖
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {words.map((w) => (
              <View
                key={w.id}
                style={{
                  backgroundColor: w.color + '22',
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderWidth: 2,
                  borderColor: w.color + '66',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}>
                <Text style={{ fontSize: 18 }}>{w.emoji}</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#374151' }}>
                  {w.word}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Start button */}
        <TouchableOpacity
          onPress={handleStart}
          activeOpacity={0.85}
          style={{
            backgroundColor: info.color,
            paddingHorizontal: 48,
            paddingVertical: 16,
            borderRadius: 28,
            boxShadow: `0px 6px 10px 0px ${info.color}80`,
          }}>
          <Text style={{ color: 'white', fontWeight: '900', fontSize: 20 }}>
            🚀 Start Level {currentLevel}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Level selector */}
      <View style={{ marginTop: 24, alignItems: 'center' }}>
        <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '600', marginBottom: 10 }}>
          Jump to level:
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {LEVEL_INFO.map((lvl) => (
            <TouchableOpacity
              key={lvl.level}
              onPress={() => {
                useGameStore.getState().setLevel(lvl.level);
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: currentLevel === lvl.level ? lvl.color : 'white',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2.5,
                borderColor: lvl.color,
              }}>
              <Text
                style={{
                  fontWeight: '900',
                  color: currentLevel === lvl.level ? 'white' : lvl.color,
                  fontSize: 15,
                }}>
                {lvl.level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
