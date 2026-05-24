/**
 * Level 1: Recognize & Point
 * The guide says a word. The child taps the correct picture from 4 options.
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Vibration } from 'react-native';
import { useGameStore, VOCABULARY, VocabWord } from '@/store/gameStore';
import GameHUD from '@/components/game/GameHUD';
import GuideAvatar from '@/components/game/GuideAvatar';
import ProgressBar from '@/components/game/ProgressBar';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Level1Screen() {
  const { activeCategory, addPoints, incrementStreak, resetStreak, unlockBadge,
          addEvalRecord, setScreen, setLevel, setGuideMessage } = useGameStore.getState();
  const guideMessage = useGameStore((s) => s.guideMessage);

  const words = VOCABULARY[activeCategory];
  const [queue, setQueue] = useState<VocabWord[]>(() => shuffle(words));
  const [qIndex, setQIndex] = useState(0);
  const [choices, setChoices] = useState<VocabWord[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const bounceAnim = useRef(new Animated.Value(1)).current;

  const target = queue[qIndex];

  // Build 4 choices (target + 3 distractors from same or other categories)
  useEffect(() => {
    if (!target) return;
    const all = Object.values(VOCABULARY).flat();
    const distractors = shuffle(all.filter((w) => w.id !== target.id)).slice(0, 3);
    setChoices(shuffle([target, ...distractors]));
    setSelected(null);
    setAnswered(false);

    // Bounce target word display
    Animated.sequence([
      Animated.timing(bounceAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
      Animated.spring(bounceAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    setGuideMessage(`Tap the picture for: "${target.word}" ${target.emoji}`);
  }, [qIndex, queue]);

  const handleSelect = (word: VocabWord) => {
    if (answered) return;
    setSelected(word.id);
    setAnswered(true);

    const correct = word.id === target.id;

    addEvalRecord({
      wordId: target.id,
      category: activeCategory,
      level: 1,
      correct,
      attempts: 1,
      timestamp: Date.now(),
    });

    if (correct) {
      addPoints(10);
      incrementStreak();
      setCorrectCount((c) => c + 1);
      setGuideMessage(`Amazing! 🌟 "${target.word}" — ${target.emoji} You got it!`);
    } else {
      resetStreak();
      setGuideMessage(`Oops! 😊 The answer was "${target.word}" ${target.emoji}. Try again!`);
    }

    setTimeout(() => {
      if (qIndex < queue.length - 1) {
        setQIndex((i) => i + 1);
      } else {
        // Level complete
        unlockBadge('explorer');
        setLevel(2);
        setScreen('celebration');
      }
    }, 1500);
  };

  if (!target) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
      <GameHUD onBack={() => setScreen('level_intro')} />

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
        {/* Progress */}
        <ProgressBar
          current={qIndex}
          total={queue.length}
          color="#22C55E"
          label={`Question ${qIndex + 1} of ${queue.length}`}
        />

        {/* Guide */}
        <View style={{ alignItems: 'center', marginVertical: 16 }}>
          <GuideAvatar size="sm" message={guideMessage} />
        </View>

        {/* Target word display */}
        <Animated.View
          style={{
            transform: [{ scale: bounceAnim }],
            backgroundColor: target.color + '22',
            borderRadius: 20,
            padding: 20,
            alignItems: 'center',
            marginBottom: 20,
            borderWidth: 3,
            borderColor: target.color + '66',
          }}>
          <Text style={{ fontSize: 20, fontWeight: '900', color: '#1F2937', marginBottom: 4 }}>
            👂 Tap the:
          </Text>
          <Text
            style={{
              fontSize: 36,
              fontWeight: '900',
              color: target.color,
              letterSpacing: 1,
            }}>
            {target.word.toUpperCase()}
          </Text>
        </Animated.View>

        {/* Choices grid */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 14,
            justifyContent: 'center',
          }}>
          {choices.map((word) => {
            const isSelected = selected === word.id;
            const isCorrect = isSelected && word.id === target.id;
            const isWrong = isSelected && word.id !== target.id;
            const isActualCorrect = answered && word.id === target.id && !isSelected;

            let bg = 'white';
            let border = '#E5E7EB';
            if (isCorrect) { bg = '#DCFCE7'; border = '#22C55E'; }
            else if (isWrong) { bg = '#FEE2E2'; border = '#EF4444'; }
            else if (isActualCorrect) { bg = '#DCFCE7'; border = '#22C55E'; }

            return (
              <TouchableOpacity
                key={word.id}
                onPress={() => handleSelect(word)}
                disabled={answered}
                activeOpacity={0.8}
                style={{
                  width: '44%',
                  backgroundColor: bg,
                  borderRadius: 20,
                  padding: 16,
                  alignItems: 'center',
                  borderWidth: 3,
                  borderColor: border,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                  elevation: 4,
                }}>
                <Text style={{ fontSize: 44 }}>{word.emoji}</Text>
                {answered && (
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '700',
                      color: isActualCorrect || isCorrect ? '#15803D' : '#374151',
                      marginTop: 6,
                    }}>
                    {word.word}
                  </Text>
                )}
                {isCorrect && (
                  <Text style={{ fontSize: 18, marginTop: 4 }}>✅</Text>
                )}
                {isWrong && (
                  <Text style={{ fontSize: 18, marginTop: 4 }}>❌</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
