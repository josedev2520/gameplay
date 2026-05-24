/**
 * Level 5: Mission Communicative
 * A mini-story mission: "Help the monkey! Give the banana to the monkey."
 * The child needs to select the correct object/action to complete the mission.
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useGameStore, VOCABULARY, Category } from '@/store/gameStore';
import GameHUD from '@/components/game/GameHUD';
import GuideAvatar from '@/components/game/GuideAvatar';
import ProgressBar from '@/components/game/ProgressBar';

interface Mission {
  id: string;
  story: string;
  instruction: string;
  question: string;
  answerEmoji: string;
  answerId: string;
  options: { id: string; emoji: string; label: string }[];
  successMessage: string;
}

const MISSIONS: Mission[] = [
  {
    id: 'm1',
    story: '🐵 The monkey is hungry! He needs something to eat.',
    instruction: 'Give the banana to the monkey!',
    question: 'Which one does the monkey need?',
    answerEmoji: '🍌',
    answerId: 'banana',
    options: [
      { id: 'banana', emoji: '🍌', label: 'Banana' },
      { id: 'pencil', emoji: '✏️', label: 'Pencil' },
      { id: 'blue', emoji: '🔵', label: 'Blue' },
      { id: 'jump', emoji: '🤸', label: 'Jump' },
    ],
    successMessage: '🎉 Yay! The monkey is happy! He says: "Thank you for the banana!"',
  },
  {
    id: 'm2',
    story: '🐶 The dog wants to play! He wants you to do something fun.',
    instruction: 'Show the dog how to jump!',
    question: 'What action should you do?',
    answerEmoji: '🤸',
    answerId: 'jump',
    options: [
      { id: 'banana', emoji: '🍌', label: 'Banana' },
      { id: 'jump', emoji: '🤸', label: 'Jump' },
      { id: 'book', emoji: '📚', label: 'Book' },
      { id: 'head', emoji: '👤', label: 'Head' },
    ],
    successMessage: '🎉 The dog barks with joy! "Woof! I love to jump!"',
  },
  {
    id: 'm3',
    story: '🐦 The bird is looking for something to read in the classroom.',
    instruction: 'Find a book for the bird!',
    question: 'Which classroom item is a book?',
    answerEmoji: '📚',
    answerId: 'book',
    options: [
      { id: 'apple', emoji: '🍎', label: 'Apple' },
      { id: 'clap', emoji: '👏', label: 'Clap' },
      { id: 'book', emoji: '📚', label: 'Book' },
      { id: 'green', emoji: '🟢', label: 'Green' },
    ],
    successMessage: '🎉 Wonderful! The bird is reading now. "Books are amazing!"',
  },
  {
    id: 'm4',
    story: '🦸 A superhero needs you! Point to the right body part.',
    instruction: 'Touch your head — the superhero needs to know!',
    question: 'Which is the HEAD?',
    answerEmoji: '👤',
    answerId: 'head',
    options: [
      { id: 'feet', emoji: '🦶', label: 'Feet' },
      { id: 'banana', emoji: '🍌', label: 'Banana' },
      { id: 'head', emoji: '👤', label: 'Head' },
      { id: 'run', emoji: '🏃', label: 'Run' },
    ],
    successMessage: '🎉 The superhero says: "You know your body parts! Amazing!"',
  },
];

export default function Level5Screen() {
  const { activeCategory, addPoints, incrementStreak, resetStreak, unlockBadge,
          addEvalRecord, setScreen, setLevel, setGuideMessage } = useGameStore.getState();
  const guideMessage = useGameStore((s) => s.guideMessage);

  const [missionIndex, setMissionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  const mission = MISSIONS[missionIndex];

  useEffect(() => {
    if (!mission) return;
    setSelected(null);
    setAnswered(false);
    setGuideMessage(`🎯 MISSION: ${mission.instruction}`);

    Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, [missionIndex]);

  const handleSelect = (id: string) => {
    if (answered) return;
    setSelected(id);
    setAnswered(true);

    const correct = id === mission.answerId;

    addEvalRecord({
      wordId: mission.answerId,
      category: activeCategory,
      level: 5,
      correct,
      attempts: 1,
      timestamp: Date.now(),
    });

    if (correct) {
      addPoints(40);
      incrementStreak();
      setGuideMessage(mission.successMessage);

      Animated.loop(
        Animated.sequence([
          Animated.timing(confettiAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(confettiAnim, { toValue: 0.5, duration: 300, useNativeDriver: true }),
        ]),
        { iterations: 4 }
      ).start();
    } else {
      resetStreak();
      setGuideMessage(`Not quite! 😊 Try again — the mission is: "${mission.instruction}"`);
    }

    setTimeout(() => {
      if (missionIndex < MISSIONS.length - 1) {
        setMissionIndex((i) => i + 1);
      } else {
        unlockBadge('hero');
        unlockBadge('champion');
        setLevel(1);
        setScreen('celebration');
      }
    }, 2200);
  };

  if (!mission) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF1F2' }}>
      <GameHUD onBack={() => setScreen('level_intro')} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 }}>
        <ProgressBar
          current={missionIndex}
          total={MISSIONS.length}
          color="#EF4444"
          label={`Mission ${missionIndex + 1} of ${MISSIONS.length}`}
        />

        <View style={{ alignItems: 'center', marginVertical: 14 }}>
          <GuideAvatar size="sm" message={guideMessage} />
        </View>

        {/* Mission badge */}
        <View style={{ alignItems: 'center', marginBottom: 14 }}>
          <View
            style={{
              backgroundColor: '#EF4444',
              borderRadius: 16,
              paddingHorizontal: 20,
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
            <Text style={{ fontSize: 18 }}>🎯</Text>
            <Text style={{ color: 'white', fontWeight: '900', fontSize: 15 }}>
              Mission {missionIndex + 1}
            </Text>
          </View>
        </View>

        {/* Story card */}
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            backgroundColor: 'white',
            borderRadius: 24,
            padding: 20,
            marginBottom: 16,
            borderWidth: 3,
            borderColor: '#EF4444',
            shadowColor: '#EF4444',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
          }}>
          <Text
            style={{
              fontSize: 17,
              color: '#374151',
              textAlign: 'center',
              lineHeight: 24,
              fontWeight: '600',
              marginBottom: 12,
            }}>
            {mission.story}
          </Text>

          <View
            style={{
              backgroundColor: '#FEF3C7',
              borderRadius: 14,
              padding: 14,
              borderWidth: 2,
              borderColor: '#F59E0B',
              marginBottom: 8,
            }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#D97706', textAlign: 'center' }}>
              📋 {mission.instruction}
            </Text>
          </View>

          <Text style={{ fontSize: 16, fontWeight: '700', color: '#6B7280', textAlign: 'center' }}>
            {mission.question}
          </Text>
        </Animated.View>

        {/* Answer options */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          {mission.options.map((opt) => {
            const isSelected = selected === opt.id;
            const isCorrect = answered && opt.id === mission.answerId;
            const isWrong = answered && isSelected && opt.id !== mission.answerId;

            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => handleSelect(opt.id)}
                disabled={answered}
                activeOpacity={0.8}
                style={{
                  width: '44%',
                  backgroundColor: isCorrect
                    ? '#DCFCE7'
                    : isWrong
                    ? '#FEE2E2'
                    : 'white',
                  borderRadius: 20,
                  padding: 18,
                  alignItems: 'center',
                  borderWidth: 3,
                  borderColor: isCorrect
                    ? '#22C55E'
                    : isWrong
                    ? '#EF4444'
                    : isSelected
                    ? '#8B5CF6'
                    : '#E5E7EB',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                  elevation: 4,
                }}>
                <Text style={{ fontSize: 44 }}>{opt.emoji}</Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '800',
                    color: isCorrect ? '#15803D' : isWrong ? '#DC2626' : '#1F2937',
                    marginTop: 8,
                  }}>
                  {opt.label}
                </Text>
                {isCorrect && <Text style={{ fontSize: 20, marginTop: 4 }}>✅</Text>}
                {isWrong && <Text style={{ fontSize: 20, marginTop: 4 }}>❌</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Answered correct celebration row */}
        {answered && selected === mission.answerId && (
          <Animated.View
            style={{
              opacity: confettiAnim,
              marginTop: 20,
              backgroundColor: '#DCFCE7',
              borderRadius: 16,
              padding: 16,
              borderWidth: 2,
              borderColor: '#22C55E',
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 24 }}>🎉🎊🏆🎊🎉</Text>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#15803D', textAlign: 'center', marginTop: 6 }}>
              {mission.successMessage}
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
