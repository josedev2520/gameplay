/**
 * Level 3: Match It!
 * Left column: emoji images. Right column: shuffled words. Child connects them.
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useGameStore, VOCABULARY, VocabWord } from '@/store/gameStore';
import GameHUD from '@/components/game/GameHUD';
import GuideAvatar from '@/components/game/GuideAvatar';
import ProgressBar from '@/components/game/ProgressBar';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Level3Screen() {
  const { activeCategory, addPoints, incrementStreak, resetStreak, unlockBadge,
          addEvalRecord, setScreen, setLevel, setGuideMessage } = useGameStore.getState();
  const guideMessage = useGameStore((s) => s.guideMessage);

  const words = VOCABULARY[activeCategory];
  const [items] = useState<VocabWord[]>(() => shuffle(words));
  const [shuffledWords] = useState<VocabWord[]>(() => shuffle(words));

  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, boolean>>({});
  const [wrong, setWrong] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setGuideMessage('Match the picture to its English word! 🔗 You\'re a detective!');
  }, []);

  const handleEmojiSelect = (id: string) => {
    if (matched[id]) return;
    setSelectedEmoji(id);
    setSelectedWord(null);
  };

  const handleWordSelect = (id: string) => {
    if (!selectedEmoji || matched[id]) return;
    setSelectedWord(id);

    if (selectedEmoji === id) {
      // Correct match
      setMatched((m) => ({ ...m, [id]: true }));
      addPoints(20);
      incrementStreak();
      setCorrectCount((c) => c + 1);
      setWrong([]);
      setSelectedEmoji(null);
      setSelectedWord(null);

      addEvalRecord({
        wordId: id,
        category: activeCategory,
        level: 3,
        correct: true,
        attempts: 1,
        timestamp: Date.now(),
      });

      const w = words.find((w) => w.id === id);
      setGuideMessage(`Matched! "${w?.word}" ${w?.emoji} — You're a word detective! 🔍`);

      // Check if all matched
      if (Object.keys(matched).length + 1 === words.length) {
        setTimeout(() => {
          unlockBadge('matcher');
          setLevel(4);
          setScreen('celebration');
        }, 1200);
      }
    } else {
      // Wrong match
      resetStreak();
      setWrong([selectedEmoji, id]);
      addEvalRecord({
        wordId: selectedEmoji,
        category: activeCategory,
        level: 3,
        correct: false,
        attempts: 1,
        timestamp: Date.now(),
      });
      setGuideMessage('Hmm, not quite! 🤔 Try a different match!');

      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();

      setTimeout(() => {
        setWrong([]);
        setSelectedEmoji(null);
        setSelectedWord(null);
      }, 1000);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF7ED' }}>
      <GameHUD onBack={() => setScreen('level_intro')} />

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
        <ProgressBar
          current={Object.keys(matched).length}
          total={words.length}
          color="#F97316"
          label={`Matched ${Object.keys(matched).length} of ${words.length}`}
        />

        <View style={{ alignItems: 'center', marginVertical: 12 }}>
          <GuideAvatar size="sm" message={guideMessage} />
        </View>

        <Animated.View
          style={{
            transform: [{ translateX: shakeAnim }],
            flexDirection: 'row',
            gap: 12,
            flex: 1,
          }}>
          {/* Left: Emoji column */}
          <View style={{ flex: 1, gap: 10 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#6B7280', textAlign: 'center', marginBottom: 4 }}>
              Pictures 🖼️
            </Text>
            {items.map((w) => {
              const isMatched = matched[w.id];
              const isSelected = selectedEmoji === w.id;
              const isWrong = wrong.includes(w.id);

              return (
                <TouchableOpacity
                  key={w.id}
                  onPress={() => handleEmojiSelect(w.id)}
                  disabled={!!isMatched}
                  style={{
                    backgroundColor: isMatched
                      ? '#DCFCE7'
                      : isWrong
                      ? '#FEE2E2'
                      : isSelected
                      ? w.color + '33'
                      : 'white',
                    borderRadius: 16,
                    padding: 14,
                    alignItems: 'center',
                    borderWidth: 3,
                    borderColor: isMatched
                      ? '#22C55E'
                      : isWrong
                      ? '#EF4444'
                      : isSelected
                      ? w.color
                      : '#E5E7EB',
                    opacity: isMatched ? 0.8 : 1,
                  }}>
                  <Text style={{ fontSize: 36 }}>{w.emoji}</Text>
                  {isMatched && (
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#15803D', marginTop: 4 }}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Connector lines area (decorative) */}
          <View style={{ width: 20, alignItems: 'center', justifyContent: 'center' }}>
            {words.map((_, i) => (
              <View
                key={i}
                style={{
                  width: 2,
                  flex: 1,
                  backgroundColor: '#E5E7EB',
                  marginVertical: 4,
                }}
              />
            ))}
          </View>

          {/* Right: Word column */}
          <View style={{ flex: 1, gap: 10 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#6B7280', textAlign: 'center', marginBottom: 4 }}>
              Words 🔤
            </Text>
            {shuffledWords.map((w) => {
              const isMatched = matched[w.id];
              const isSelected = selectedWord === w.id;
              const isWrong = wrong.includes(w.id);

              return (
                <TouchableOpacity
                  key={w.id}
                  onPress={() => handleWordSelect(w.id)}
                  disabled={!!isMatched}
                  style={{
                    backgroundColor: isMatched
                      ? '#DCFCE7'
                      : isWrong
                      ? '#FEE2E2'
                      : isSelected
                      ? w.color + '33'
                      : 'white',
                    borderRadius: 16,
                    padding: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 3,
                    borderColor: isMatched
                      ? '#22C55E'
                      : isWrong
                      ? '#EF4444'
                      : isSelected
                      ? w.color
                      : '#E5E7EB',
                    opacity: isMatched ? 0.8 : 1,
                    minHeight: 66,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '800',
                      color: isMatched ? '#15803D' : '#1F2937',
                      textAlign: 'center',
                    }}>
                    {w.word}
                  </Text>
                  {isMatched && <Text style={{ fontSize: 12, color: '#15803D' }}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
