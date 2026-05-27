import React, { useState } from 'react';
import { ArrowLeft, BookOpen, ListChecks, BadgeCheck, Gauge, Trophy, BarChart4, Book, Lightbulb } from 'lucide-react-native';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useGameStore, CATEGORY_LABELS, VOCABULARY, Category } from '@/store/gameStore';
import ProgressBar from '@/components/game/ProgressBar';

const LEVEL_NAMES: Record<number, string> = {
  1: 'Recognize & Point',
  2: 'Repeat & Speak',
  3: 'Match Words',
  4: 'Build Sentence',
  5: 'Mission',
};

export default function TeacherPanelScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const evalRecords = useGameStore((s) => s.evalRecords);
  const badges = useGameStore((s) => s.badges);
  const points = useGameStore((s) => s.points);
  const [activeTab, setActiveTab] = useState<'overview' | 'vocab' | 'guide'>('overview');

  // Compute stats
  const total = evalRecords.length;
  const correct = evalRecords.filter((r) => r.correct).length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  // By level
  const byLevel: Record<number, { correct: number; total: number }> = {};
  evalRecords.forEach((r) => {
    if (!byLevel[r.level]) byLevel[r.level] = { correct: 0, total: 0 };
    byLevel[r.level].total += 1;
    if (r.correct) byLevel[r.level].correct += 1;
  });

  // By category
  const byCategory: Record<string, { correct: number; total: number }> = {};
  evalRecords.forEach((r) => {
    const key = r.category;
    if (!byCategory[key]) byCategory[key] = { correct: 0, total: 0 };
    byCategory[key].total += 1;
    if (r.correct) byCategory[key].correct += 1;
  });

  // Most difficult words
  const byWord: Record<string, { correct: number; total: number }> = {};
  evalRecords.forEach((r) => {
    if (!byWord[r.wordId]) byWord[r.wordId] = { correct: 0, total: 0 };
    byWord[r.wordId].total += 1;
    if (r.correct) byWord[r.wordId].correct += 1;
  });

  const difficultWords = Object.entries(byWord)
    .filter(([_, s]) => s.total >= 1 && s.correct / s.total < 0.7)
    .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
    .slice(0, 5);

  const GUIDE_TIPS = [
    {
      icon: '🎤',
      title: 'Model Pronunciation',
      desc: 'Always pronounce words clearly and slowly. Repeat 3 times: normal, slow, normal. Encourage children to echo.',
    },
    {
      icon: '✅',
      title: 'Positive Correction',
      desc: 'Instead of "wrong", say "Almost! Let\'s try again together!" — keep the mood encouraging.',
    },
    {
      icon: '🌟',
      title: 'Celebrate Effort',
      desc: 'Reward attempts, not just correct answers. Give sticker points for brave tries too!',
    },
    {
      icon: '👐',
      title: 'Total Physical Response',
      desc: 'For body parts and actions, have children physically move — touch their head, jump, clap.',
    },
    {
      icon: '🔄',
      title: 'Spaced Repetition',
      desc: 'Review previous words before each new level. Quick 2-min warm-up with flashcards or chant.',
    },
    {
      icon: '👫',
      title: 'Cooperative Learning',
      desc: 'Pair stronger and developing learners together. Have them discuss choices before answering.',
    },
    {
      icon: '📊',
      title: 'Use Analytics',
      desc: 'Check the Analytics tab after each session to identify which words need more practice.',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#1E1B4B',
          paddingTop: 48,
          paddingBottom: 20,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}>
        <TouchableOpacity onPress={() => setScreen('home')}>
          <ArrowLeft color="#A5B4FC" size={24} />
        </TouchableOpacity>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <BookOpen color="#A5B4FC" size={24} />
            <Text style={{ color: 'white', fontWeight: '900', fontSize: 20 }}>
              Teacher Panel
            </Text>
          </View>
          <Text style={{ color: '#A5B4FC', fontSize: 12 }}>
            Analytics & Pedagogical Guide
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          borderBottomWidth: 2,
          borderBottomColor: '#E5E7EB',
          paddingHorizontal: 16,
          paddingTop: 8,
        }}>
        {(['overview', 'vocab', 'guide'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderBottomWidth: 3,
              borderBottomColor: activeTab === tab ? '#7C3AED' : 'transparent',
              marginRight: 4,
            }}>
            <Text
              style={{
                fontWeight: '700',
                fontSize: 13,
                color: activeTab === tab ? '#5B21B6' : '#9CA3AF',
              }}>
              {tab === 'overview' ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <BarChart4 color={activeTab === 'overview' ? '#5B21B6' : '#9CA3AF'} size={18} />
                  <Text style={{ color: activeTab === 'overview' ? '#5B21B6' : '#9CA3AF' }}>Analytics</Text>
                </View>
              ) : tab === 'vocab' ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Book color={activeTab === 'vocab' ? '#5B21B6' : '#9CA3AF'} size={18} />
                  <Text style={{ color: activeTab === 'vocab' ? '#5B21B6' : '#9CA3AF' }}>Vocabulary</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Lightbulb color={activeTab === 'guide' ? '#5B21B6' : '#9CA3AF'} size={18} />
                  <Text style={{ color: activeTab === 'guide' ? '#5B21B6' : '#9CA3AF' }}>Guide Tips</Text>
                </View>
              )}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {activeTab === 'overview' && (
          <>
            {/* Stats summary */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Total Answers', value: total, icon: <ListChecks color="#3B82F6" size={24} />, color: '#3B82F6' },
                { label: 'Correct', value: correct, icon: <BadgeCheck color="#22C55E" size={24} />, color: '#22C55E' },
                { label: 'Accuracy', value: `${accuracy}%`, icon: <Gauge color="#8B5CF6" size={24} />, color: '#8B5CF6' },
                { label: 'Points', value: points, icon: <Trophy color="#F59E0B" size={24} />, color: '#F59E0B' },
              ].map((stat) => (
                <View
                  key={stat.label}
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                    borderRadius: 14,
                    padding: 12,
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: stat.color + '44',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}>
                  {stat.icon}
                  <Text style={{ fontSize: 18, fontWeight: '900', color: stat.color }}>
                    {stat.value}
                  </Text>
                  <Text style={{ fontSize: 9, color: '#9CA3AF', fontWeight: '600', textAlign: 'center' }}>
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* By level */}
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
                borderWidth: 2,
                borderColor: '#E0E7FF',
              }}>
              <Text style={{ fontWeight: '800', fontSize: 15, color: '#1F2937', marginBottom: 12 }}>
                📈 Progress by Level
              </Text>
              {[1, 2, 3, 4, 5].map((lvl) => {
                const stats = byLevel[lvl] ?? { correct: 0, total: 0 };
                const pct = stats.total > 0 ? stats.correct / stats.total : 0;
                return (
                  <View key={lvl} style={{ marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151' }}>
                        Level {lvl}: {LEVEL_NAMES[lvl]}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#6B7280' }}>
                        {stats.correct}/{stats.total}
                      </Text>
                    </View>
                    <ProgressBar current={stats.correct} total={Math.max(stats.total, 1)} color="#8B5CF6" />
                  </View>
                );
              })}
            </View>

            {/* By category */}
            {Object.keys(byCategory).length > 0 && (
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 16,
                  borderWidth: 2,
                  borderColor: '#DCFCE7',
                }}>
                <Text style={{ fontWeight: '800', fontSize: 15, color: '#1F2937', marginBottom: 12 }}>
                  🗂️ Performance by Category
                </Text>
                {Object.entries(byCategory).map(([cat, stats]) => (
                  <View key={cat} style={{ marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151' }}>
                        {CATEGORY_LABELS[cat as Category] ?? cat}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#6B7280' }}>
                        {Math.round((stats.correct / stats.total) * 100)}%
                      </Text>
                    </View>
                    <ProgressBar current={stats.correct} total={stats.total} color="#22C55E" />
                  </View>
                ))}
              </View>
            )}

            {/* Difficult words */}
            {difficultWords.length > 0 && (
              <View
                style={{
                  backgroundColor: '#FFF7ED',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 16,
                  borderWidth: 2,
                  borderColor: '#FED7AA',
                }}>
                <Text style={{ fontWeight: '800', fontSize: 15, color: '#1F2937', marginBottom: 12 }}>
                  ⚠️ Words Needing More Practice
                </Text>
                {difficultWords.map(([wordId, stats]) => {
                  const allWords = Object.values(VOCABULARY).flat();
                  const w = allWords.find((v) => v.id === wordId);
                  if (!w) return null;
                  return (
                    <View
                      key={wordId}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 8,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        padding: 10,
                        borderWidth: 1.5,
                        borderColor: '#FED7AA',
                      }}>
                      <Text style={{ fontSize: 24 }}>{w.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '700', color: '#374151' }}>{w.word}</Text>
                        <Text style={{ fontSize: 11, color: '#9CA3AF' }}>
                          {stats.correct}/{stats.total} correct
                        </Text>
                      </View>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#F97316' }}>
                        {Math.round((stats.correct / stats.total) * 100)}%
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Badges */}
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                borderWidth: 2,
                borderColor: '#FDE68A',
              }}>
              <Text style={{ fontWeight: '800', fontSize: 15, color: '#1F2937', marginBottom: 12 }}>
                🏅 Badges Earned
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {badges.map((badge) => (
                  <View
                    key={badge.id}
                    style={{
                      backgroundColor: badge.unlocked ? '#FEF3C7' : '#F3F4F6',
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      alignItems: 'center',
                      borderWidth: 2,
                      borderColor: badge.unlocked ? '#F59E0B' : '#E5E7EB',
                      opacity: badge.unlocked ? 1 : 0.4,
                      minWidth: 70,
                    }}>
                    <Text style={{ fontSize: 22 }}>{badge.emoji}</Text>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '700',
                        color: badge.unlocked ? '#D97706' : '#9CA3AF',
                        marginTop: 2,
                        textAlign: 'center',
                      }}>
                      {badge.label}
                    </Text>
                    <Text style={{ fontSize: 9, color: badge.unlocked ? '#22C55E' : '#9CA3AF' }}>
                      {badge.unlocked ? '✓ Earned' : '🔒 Locked'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {total === 0 && (
              <View style={{ alignItems: 'center', marginTop: 24 }}>
                <Text style={{ fontSize: 40 }}>🎮</Text>
                <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8, textAlign: 'center' }}>
                  No game data yet. Start playing to see analytics here!
                </Text>
              </View>
            )}
          </>
        )}

        {activeTab === 'vocab' && (
          <>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '800',
                color: '#1F2937',
                marginBottom: 16,
                textAlign: 'center',
              }}>
              📖 Complete Vocabulary Reference
            </Text>
            {Object.entries(VOCABULARY).map(([cat, words]) => (
              <View
                key={cat}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 14,
                  borderWidth: 2,
                  borderColor: '#E0E7FF',
                }}>
                <Text style={{ fontWeight: '800', fontSize: 14, color: '#374151', marginBottom: 10 }}>
                  {CATEGORY_LABELS[cat as Category]}
                </Text>
                <View style={{ gap: 8 }}>
                  {words.map((w) => (
                    <View
                      key={w.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: w.color + '15',
                        borderRadius: 10,
                        padding: 10,
                        borderWidth: 1.5,
                        borderColor: w.color + '44',
                        gap: 12,
                      }}>
                      <Text style={{ fontSize: 28 }}>{w.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '800', fontSize: 16, color: '#1F2937' }}>
                          {w.word}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#9CA3AF' }}>
                          Category: {cat} • ID: {w.id}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 8,
                          backgroundColor: w.color,
                        }}
                      />
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === 'guide' && (
          <>
            <View
              style={{
                backgroundColor: '#FEF3C7',
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
                borderWidth: 2,
                borderColor: '#F59E0B',
              }}>
              <Text style={{ fontWeight: '800', fontSize: 16, color: '#D97706', marginBottom: 8 }}>
                🦉 About WordQuest
              </Text>
              <Text style={{ fontSize: 13, color: '#374151', lineHeight: 20 }}>
                WordQuest: The Magic English Island is a gamified, communicative approach to early
                English vocabulary acquisition for children aged 5–7. It follows the 5-level progression
                from recognition → speaking → matching → building → mission, aligned with SLA (Second
                Language Acquisition) principles for early childhood.
              </Text>
            </View>

            {GUIDE_TIPS.map((tip, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 2,
                  borderColor: '#E0E7FF',
                  flexDirection: 'row',
                  gap: 12,
                }}>
                <Text style={{ fontSize: 28 }}>{tip.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '800', fontSize: 14, color: '#1F2937', marginBottom: 4 }}>
                    {tip.title}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#4B5563', lineHeight: 19 }}>
                    {tip.desc}
                  </Text>
                </View>
              </View>
            ))}

            {/* Evaluation criteria */}
            <View
              style={{
                backgroundColor: '#F0FDF4',
                borderRadius: 16,
                padding: 16,
                borderWidth: 2,
                borderColor: '#86EFAC',
                marginTop: 4,
              }}>
              <Text style={{ fontWeight: '800', fontSize: 14, color: '#15803D', marginBottom: 10 }}>
                📋 Evaluation Criteria
              </Text>
              {[
                { icon: '👁️', label: 'Participation', desc: 'Engagement level and enthusiasm during activities' },
                { icon: '🧠', label: 'Comprehension', desc: 'Correct identification of vocabulary (Level 1 & 3)' },
                { icon: '🎤', label: 'Pronunciation', desc: 'Speaking attempts and clarity score (Level 2)' },
                { icon: '🔗', label: 'Association', desc: 'Word-image matching accuracy (Level 3)' },
                { icon: '💬', label: 'Sentence Use', desc: 'Correct sentence construction (Level 4)' },
                { icon: '🎯', label: 'Communication', desc: 'Mission completion and context use (Level 5)' },
              ].map((crit) => (
                <View
                  key={crit.label}
                  style={{ flexDirection: 'row', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 18 }}>{crit.icon}</Text>
                  <View>
                    <Text style={{ fontWeight: '700', fontSize: 13, color: '#1F2937' }}>{crit.label}</Text>
                    <Text style={{ fontSize: 12, color: '#4B5563' }}>{crit.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
