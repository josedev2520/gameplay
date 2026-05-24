import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useGameStore, CATEGORIES_ORDER, CATEGORY_LABELS, CATEGORY_BG, Category } from '@/store/gameStore';

export default function CategorySelect() {
  const setCategory = useGameStore((s) => s.setCategory);
  const setLevel = useGameStore((s) => s.setLevel);
  const setScreen = useGameStore((s) => s.setScreen);

  const handleSelect = (cat: Category) => {
    setCategory(cat);
    setLevel(1);
    setScreen('level_intro');
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#F8FAFF' }}>
      <Text style={{ fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 16 }}>
        Select a Category
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
        {CATEGORIES_ORDER.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => handleSelect(cat)}
            style={{
              width: '44%',
              backgroundColor: CATEGORY_BG[cat],
              borderRadius: 14,
              padding: 16,
              margin: 6,
              alignItems: 'center',
              borderWidth: 2,
              borderColor: '#fff',
            }}>
            <Text style={{ fontSize: 16, fontWeight: '800' }}>{CATEGORY_LABELS[cat]}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity onPress={() => setScreen('home')} style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={{ color: '#6B7280' }}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}
