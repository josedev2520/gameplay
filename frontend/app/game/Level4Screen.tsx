/**
 * Level 4: Build a Sentence
 * Given a template like "I see a [Object]" or "It is a [Color] [Animal]"
 * The child taps word tiles to fill in the blank.
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useGameStore, VOCABULARY, Category } from '@/store/gameStore';
import GameHUD from '@/components/game/GameHUD';
import GuideAvatar from '@/components/game/GuideAvatar';
import ProgressBar from '@/components/game/ProgressBar';

interface SentenceTask {
  template: string; // "I see a ___"
  answer: string;   // correct word
  hint: string;     // emoji hint
  options: string[]; // choices
  category: Category;
}

function buildTasks(category: Category): SentenceTask[] {
  const words = VOCABULARY[category];
  return words.map((w) => {
    const others = Object.values(VOCABULARY).flat().filter((v) => v.id !== w.id);
    const distractors = [...others].sort(() => Math.random() - 0.5).slice(0, 3).map((v) => v.word);
    const options = [...distractors, w.word].sort(() => Math.random() - 0.5);
    return {
      template: `I see a ___!`,
      answer: w.word,
      hint: w.emoji,
      options,
      category,
    };
  });
}

export default function Level4Screen() {
  const { activeCategory, addPoints, incrementStreak, resetStreak, unlockBadge,
          addEvalRecord, setScreen, setLevel, setGuideMessage } = useGameStore.getState();
  const guideMessage = useGameStore((s) => s.guideMessage);

  const [tasks] = useState<SentenceTask[]>(() => buildTasks(activeCategory));
  const [taskIndex, setTaskIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const task = tasks[taskIndex];

  useEffect(() => {
    if (!task) return;
    setSelectedWord(null);
    setAnswered(false);
    setGuideMessage(`Fill in the blank! 🏗️ "${task.template}" — look at the hint: ${task.hint}`);

    Animated.sequence([
      Animated.timing(slideAnim, { toValue: 50, duration: 0, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 6, useNativeDriver: true }),
    ]).start();
  }, [taskIndex]);

  const handleSelect = (word: string) => {
    if (answered) return;
    setSelectedWord(word);
    setAnswered(true);

    const correct = word === task.answer;

    addEvalRecord({
      wordId: task.answer.toLowerCase(),
      category: activeCategory,
      level: 4,
      correct,
      attempts: 1,
      timestamp: Date.now(),
    });

    if (correct) {
      addPoints(25);
      incrementStreak();
      setCorrectCount((c) => c + 1);
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
      setGuideMessage(`Great sentence! 🌟 "I see a ${task.answer}!" — Perfect!`);
    } else {
      resetStreak();
      setGuideMessage(`Oops! 😊 The answer was "${task.answer}" ${task.hint}. You can do it!`);
    }

    setTimeout(() => {
      if (taskIndex < tasks.length - 1) {
        setTaskIndex((i) => i + 1);
      } else {
        unlockBadge('builder');
        setLevel(5);
        setScreen('celebration');
      }
    }, 1800);
  };

  if (!task) return null;

  // Build sentence display: split template and add filled word
  const sentenceWithAnswer = answered
    ? task.template.replace('___', selectedWord || '___')
    : task.template;

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F3FF' }}>
      <GameHUD onBack={() => setScreen('level_intro')} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 }}>
        <ProgressBar
          current={taskIndex}
          total={tasks.length}
          color="#8B5CF6"
          label={`Sentence ${taskIndex + 1} of ${tasks.length}`}
        />

        <View style={{ alignItems: 'center', marginVertical: 14 }}>
          <GuideAvatar size="sm" message={guideMessage} />
        </View>

        {/* Hint emoji */}
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 16,
              borderWidth: 3,
              borderColor: '#8B5CF6',
              boxShadow: '0px 4px 8px 0px #8B5CF633',
            }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#6B7280', marginBottom: 6, textAlign: 'center' }}>
              🔍 Hint:
            </Text>
            <Text style={{ fontSize: 64, textAlign: 'center' }}>{task.hint}</Text>
          </View>
        </View>

        {/* Sentence builder */}
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            backgroundColor: 'white',
            borderRadius: 24,
            padding: 20,
            marginBottom: 20,
            borderWidth: 3,
            borderColor: answered
              ? selectedWord === task.answer
                ? '#22C55E'
                : '#EF4444'
              : '#8B5CF6',
            boxShadow: '0px 6px 12px 0px #8B5CF626',
          }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#6B7280', marginBottom: 10, textAlign: 'center' }}>
            Complete the sentence:
          </Text>

          {/* Template with blank */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 6 }}>
            {task.template.split('___').map((part, i) => (
              <React.Fragment key={i}>
                {part.trim() ? (
                  <Text style={{ fontSize: 22, fontWeight: '700', color: '#1F2937' }}>
                    {part.trim()}
                  </Text>
                ) : null}
                {i === 0 && (
                  <View
                    style={{
                      backgroundColor: selectedWord
                        ? answered && selectedWord === task.answer
                          ? '#DCFCE7'
                          : answered
                          ? '#FEE2E2'
                          : '#EDE9FE'
                        : '#EDE9FE',
                      borderRadius: 10,
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                      borderWidth: 2.5,
                      borderColor: selectedWord
                        ? answered && selectedWord === task.answer
                          ? '#22C55E'
                          : answered
                          ? '#EF4444'
                          : '#7C3AED'
                        : '#7C3AED',
                      minWidth: 80,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '900',
                        color: selectedWord
                          ? answered && selectedWord === task.answer
                            ? '#15803D'
                            : answered
                            ? '#DC2626'
                            : '#5B21B6'
                          : '#9CA3AF',
                      }}>
                      {selectedWord || '?'}
                    </Text>
                  </View>
                )}
              </React.Fragment>
            ))}
          </View>

          {answered && (
            <Text
              style={{
                fontSize: 14,
                textAlign: 'center',
                marginTop: 12,
                fontWeight: '700',
                color: selectedWord === task.answer ? '#15803D' : '#DC2626',
              }}>
              {selectedWord === task.answer
                ? `✅ "I see a ${task.answer}!" — Correct!`
                : `❌ Answer: "${task.answer}" ${task.hint}`}
            </Text>
          )}
        </Animated.View>

        {/* Word choices */}
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#6B7280', textAlign: 'center', marginBottom: 12 }}>
          Choose the right word:
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {task.options.map((opt) => {
            const isSelected = selectedWord === opt;
            const isCorrect = answered && opt === task.answer;
            const isWrong = answered && isSelected && opt !== task.answer;

            return (
              <TouchableOpacity
                key={opt}
                onPress={() => handleSelect(opt)}
                disabled={answered}
                activeOpacity={0.8}
                style={{
                  backgroundColor: isCorrect
                    ? '#DCFCE7'
                    : isWrong
                    ? '#FEE2E2'
                    : isSelected
                    ? '#EDE9FE'
                    : 'white',
                  borderRadius: 16,
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                  borderWidth: 3,
                  borderColor: isCorrect
                    ? '#22C55E'
                    : isWrong
                    ? '#EF4444'
                    : isSelected
                    ? '#8B5CF6'
                    : '#E5E7EB',
                  minWidth: '44%',
                  alignItems: 'center',
                  boxShadow: '0px 2px 4px 0px #8B5CF61A',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '800',
                    color: isCorrect ? '#15803D' : isWrong ? '#DC2626' : '#1F2937',
                  }}>
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
