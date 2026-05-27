import React, { useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import { View, Text, TouchableOpacity, Animated, Platform } from 'react-native';
import { useGameStore } from '@/store/gameStore';

interface GameHUDProps {
  onBack?: () => void;
}

export default function GameHUD({ onBack }: GameHUDProps) {
  const points = useGameStore((s) => s.points);
  const streak = useGameStore((s) => s.streak);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const badges = useGameStore((s) => s.badges);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevPoints = useRef(points);

  useEffect(() => {
    if (points !== prevPoints.current) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.4,
          duration: 150,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
      prevPoints.current = points;
    }
  }, [points]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderBottomWidth: 2,
        borderBottomColor: '#FDE68A',
        boxShadow: '0px 2px 4px 0px #00000014',
      }}>
      {/* Back button */}
      <TouchableOpacity
        onPress={onBack}
        style={{
          backgroundColor: '#FEF3C7',
          borderRadius: 20,
          width: 36,
          height: 36,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: '#F59E0B',
        }}>
        <ArrowLeft color="#F59E0B" size={24} />
      </TouchableOpacity>

      {/* Level badge */}
      <View
        style={{
          backgroundColor: '#8B5CF6',
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 4,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}>
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 12 }}>
          Level {currentLevel}
        </Text>
        <Text style={{ fontSize: 12 }}>⭐</Text>
      </View>

      {/* Points */}
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          backgroundColor: '#FEF3C7',
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 4,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: '#F59E0B',
        }}>
        <Text style={{ fontSize: 14 }}>⭐</Text>
        <Text style={{ fontWeight: '800', color: '#D97706', fontSize: 16, marginLeft: 4 }}>
          {points}
        </Text>
      </Animated.View>

      {/* Streak */}
      <View
        style={{
          backgroundColor: streak >= 3 ? '#FEE2E2' : '#F3F4F6',
          borderRadius: 12,
          paddingHorizontal: 10,
          paddingVertical: 4,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: streak >= 3 ? '#EF4444' : '#E5E7EB',
        }}>
        <Text style={{ fontSize: 14 }}>🔥</Text>
        <Text
          style={{
            fontWeight: '700',
            color: streak >= 3 ? '#DC2626' : '#6B7280',
            fontSize: 14,
            marginLeft: 3,
          }}>
          {streak}
        </Text>
      </View>

      {/* Badges */}
      <View
        style={{
          backgroundColor: '#DBEAFE',
          borderRadius: 12,
          paddingHorizontal: 10,
          paddingVertical: 4,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: '#3B82F6',
        }}>
        <Text style={{ fontSize: 14 }}>🏅</Text>
        <Text style={{ fontWeight: '700', color: '#1D4ED8', fontSize: 14, marginLeft: 3 }}>
          {unlockedCount}
        </Text>
      </View>
    </View>
  );
}
