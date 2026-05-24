import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { useGameStore, CATEGORIES_ORDER, CATEGORY_LABELS, CATEGORY_BG, Category } from '@/store/gameStore';
import GuideAvatar from '@/components/game/GuideAvatar';

const CATEGORY_ICONS: Record<Category, string> = {
  colors: '🎨',
  animals: '🐾',
  fruits: '🍎',
  classroom: '📚',
  body: '🙌',
  actions: '🏃',
};

export default function HomeScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const setCategory = useGameStore((s) => s.setCategory);
  const setLevel = useGameStore((s) => s.setLevel);
  const setMode = useGameStore((s) => s.setMode);
  const mode = useGameStore((s) => s.mode);
  const points = useGameStore((s) => s.points);
  const badges = useGameStore((s) => s.badges);
  const setGuideMessage = useGameStore((s) => s.setGuideMessage);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setGuideMessage("Hi Explorer! 🧭 Pick a category to start your adventure!");
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
    setLevel(1);
    setScreen('level_intro');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F9FF' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#1E1B4B',
          paddingTop: 48,
          paddingBottom: 20,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text style={{ color: '#FDE68A', fontWeight: '900', fontSize: 22 }}>
            WordQuest 🏝️
          </Text>
          <Text style={{ color: '#A5B4FC', fontSize: 12, marginTop: 2 }}>
            Magic English Island
          </Text>
        </View>
        {/* Stats row */}
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: '#FEF3C7',
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 6,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: '#F59E0B',
            }}>
            <Text style={{ fontWeight: '900', color: '#D97706', fontSize: 16 }}>
              ⭐ {points}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setScreen('teacher_panel')}
            style={{
              backgroundColor: '#DBEAFE',
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderWidth: 2,
              borderColor: '#3B82F6',
            }}>
            <Text style={{ fontSize: 18 }}>👩‍🏫</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}>
        {/* Guide Avatar */}
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <GuideAvatar size="md" />
        </View>

        {/* Mode selector */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 14,
            marginBottom: 20,
            borderWidth: 2,
            borderColor: '#E0E7FF',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 3,
          }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: '#374151',
              marginBottom: 10,
              textAlign: 'center',
            }}>
            🎮 Game Mode
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={() => setMode('individual')}
              style={{
                flex: 1,
                backgroundColor: mode === 'individual' ? '#EDE9FE' : '#F9FAFB',
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: 'center',
                borderWidth: 2.5,
                borderColor: mode === 'individual' ? '#7C3AED' : '#E5E7EB',
              }}>
              <Text style={{ fontSize: 22 }}>🧒</Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: mode === 'individual' ? '#5B21B6' : '#6B7280',
                  marginTop: 4,
                }}>
                Solo Explorer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('cooperative')}
              style={{
                flex: 1,
                backgroundColor: mode === 'cooperative' ? '#DCFCE7' : '#F9FAFB',
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: 'center',
                borderWidth: 2.5,
                borderColor: mode === 'cooperative' ? '#16A34A' : '#E5E7EB',
              }}>
              <Text style={{ fontSize: 22 }}>👫</Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: mode === 'cooperative' ? '#15803D' : '#6B7280',
                  marginTop: 4,
                }}>
                Team Mission
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category grid */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: '800',
            color: '#1F2937',
            marginBottom: 14,
            textAlign: 'center',
          }}>
          🗺️ Choose Your Island Station
        </Text>

        <Animated.View
          style={{
            opacity: fadeAnim,
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'center',
          }}>
          {CATEGORIES_ORDER.map((cat, idx) => (
            <TouchableOpacity
              key={cat}
              onPress={() => handleCategorySelect(cat)}
              activeOpacity={0.82}
              style={{
                width: '44%',
                backgroundColor: CATEGORY_BG[cat],
                borderRadius: 20,
                padding: 18,
                alignItems: 'center',
                borderWidth: 3,
                borderColor: 'white',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
              }}>
              <Text style={{ fontSize: 40, marginBottom: 6 }}>
                {CATEGORY_ICONS[cat]}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '800',
                  color: '#1F2937',
                  textAlign: 'center',
                }}>
                {CATEGORY_LABELS[cat]}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Badges row */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 14,
            marginTop: 24,
            borderWidth: 2,
            borderColor: '#FDE68A',
          }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: '#374151',
              marginBottom: 10,
              textAlign: 'center',
            }}>
            🏅 Your Badges
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
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
                  opacity: badge.unlocked ? 1 : 0.5,
                  minWidth: 70,
                }}>
                <Text style={{ fontSize: 24 }}>{badge.emoji}</Text>
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
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setScreen('splash')}
          style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: '#9CA3AF', fontSize: 13 }}>← Back to Start</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
