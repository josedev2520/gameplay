/**
 * Level 2: Repeat & Speak
 * The guide shows a word with its image. The child taps the mic to "repeat" it.
 * A simulated pronunciation feedback with confidence score.
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { useGameStore, VOCABULARY, VocabWord } from '@/store/gameStore';
import GameHUD from '@/components/game/GameHUD';
import GuideAvatar from '@/components/game/GuideAvatar';
import ProgressBar from '@/components/game/ProgressBar';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Level2Screen() {
  const { activeCategory, addPoints, incrementStreak, resetStreak, unlockBadge,
          addEvalRecord, setScreen, setLevel, setGuideMessage } = useGameStore.getState();
  const guideMessage = useGameStore((s) => s.guideMessage);

  const words = VOCABULARY[activeCategory];
  const [queue] = useState<VocabWord[]>(() => shuffle(words));
  const [qIndex, setQIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const micAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const pulseRef = useRef<Animated.CompositeAnimation | null>(null);

  const target = queue[qIndex];

  useEffect(() => {
    if (!target) return;
    setHasSpoken(false);
    setScore(null);
    setIsListening(false);
    setGuideMessage(`Listen, then say: "${target.word}" ${target.emoji} — be brave! 🎤`);
  }, [qIndex]);

  const startListening = () => {
    if (hasSpoken) return;
    setIsListening(true);
    setGuideMessage('I\'m listening... 🎧 Say the word!');

    pulseRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 400, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    );
    pulseRef.current.start();

    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Simulate speech recognition result after 2s
    setTimeout(() => {
      pulseRef.current?.stop();
      setIsListening(false);
      // Simulate score 60–100
      const simScore = 60 + Math.floor(Math.random() * 41);
      setScore(simScore);
      setHasSpoken(true);

      const correct = simScore >= 70;
      addEvalRecord({
        wordId: target.id,
        category: activeCategory,
        level: 2,
        correct,
        attempts: 1,
        timestamp: Date.now(),
      });

      if (correct) {
        addPoints(15);
        incrementStreak();
        setGuideMessage(
          simScore >= 90
            ? `Perfect! 🌟 "${target.word}" — You're a star speaker!`
            : `Great job! 👏 "${target.word}" — Keep practicing!`
        );
      } else {
        resetStreak();
        setGuideMessage(`Good try! 😊 "${target.word}" — Listen again and practice!`);
      }

      setTimeout(() => {
        if (qIndex < queue.length - 1) {
          setQIndex((i) => i + 1);
        } else {
          unlockBadge('speaker');
          setLevel(3);
          setScreen('celebration');
        }
      }, 2000);
    }, 2200);
  };

  if (!target) return null;

  const scoreColor =
    score !== null ? (score >= 90 ? '#22C55E' : score >= 70 ? '#3B82F6' : '#F97316') : '#6B7280';

  const scoreLabel =
    score !== null
      ? score >= 90
        ? '🌟 Perfect!'
        : score >= 70
        ? '👏 Great!'
        : '😊 Keep trying!'
      : '';

  return (
    <View style={{ flex: 1, backgroundColor: '#EFF6FF' }}>
      <GameHUD onBack={() => setScreen('level_intro')} />

      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 12,
          alignItems: 'center',
        }}>
        <ProgressBar
          current={qIndex}
          total={queue.length}
          color="#3B82F6"
          label={`Word ${qIndex + 1} of ${queue.length}`}
        />

        <View style={{ alignItems: 'center', marginVertical: 16 }}>
          <GuideAvatar size="sm" message={guideMessage} />
        </View>

        {/* Word showcase */}
        <View
          style={{
            backgroundColor: target.color + '22',
            borderRadius: 28,
            padding: 28,
            alignItems: 'center',
            width: '100%',
            borderWidth: 3,
            borderColor: target.color,
            marginBottom: 24,
            shadowColor: target.color,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
          }}>
          <Text style={{ fontSize: 80 }}>{target.emoji}</Text>
          <Text
            style={{
              fontSize: 36,
              fontWeight: '900',
              color: target.color,
              marginTop: 10,
              letterSpacing: 2,
            }}>
            {target.word}
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 6 }}>
            {target.category}
          </Text>
        </View>

        {/* Score display */}
        {score !== null && (
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 16,
              alignItems: 'center',
              width: '100%',
              borderWidth: 3,
              borderColor: scoreColor,
              marginBottom: 16,
            }}>
            <Text style={{ fontSize: 28, fontWeight: '900', color: scoreColor }}>
              {score}%
            </Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: scoreColor }}>
              {scoreLabel}
            </Text>
            <View style={{ marginTop: 10, width: '80%', backgroundColor: '#E5E7EB', borderRadius: 6, height: 12, overflow: 'hidden' }}>
              <View
                style={{
                  width: `${score}%`,
                  height: '100%',
                  backgroundColor: scoreColor,
                  borderRadius: 6,
                }}
              />
            </View>
          </View>
        )}

        {/* Mic button */}
        {!hasSpoken && (
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              onPress={startListening}
              disabled={isListening}
              activeOpacity={0.85}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: isListening ? '#EF4444' : '#3B82F6',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: isListening ? '#EF4444' : '#3B82F6',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.5,
                shadowRadius: 12,
                elevation: 10,
                borderWidth: 4,
                borderColor: isListening ? '#B91C1C' : '#1D4ED8',
              }}>
              <Text style={{ fontSize: 44 }}>{isListening ? '🎙️' : '🎤'}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {!hasSpoken && !isListening && (
          <Text style={{ color: '#6B7280', fontSize: 14, marginTop: 12, fontWeight: '600' }}>
            Tap the mic and say the word!
          </Text>
        )}

        {isListening && (
          <View style={{ flexDirection: 'row', gap: 4, marginTop: 12 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Animated.View
                key={i}
                style={{
                  width: 6,
                  height: 6 + i * 4,
                  borderRadius: 3,
                  backgroundColor: '#3B82F6',
                  opacity: waveAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3 + i * 0.1, 1],
                  }),
                }}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
