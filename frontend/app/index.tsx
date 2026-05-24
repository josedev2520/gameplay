import React from 'react';
import { View, StatusBar } from 'react-native';
import { useGameStore } from '@/store/gameStore';

// Screens
import SplashScreen from './game/SplashScreen';
import HomeScreen from './game/HomeScreen';
import LevelIntroScreen from './game/LevelIntroScreen';
import Level1Screen from './game/Level1Screen';
import Level2Screen from './game/Level2Screen';
import Level3Screen from './game/Level3Screen';
import Level4Screen from './game/Level4Screen';
import Level5Screen from './game/Level5Screen';
import CelebrationScreen from './game/CelebrationScreen';
import TeacherPanelScreen from './game/TeacherPanelScreen';
import CategorySelect from './game/CategorySelect';

export default function Screen() {
  const screen = useGameStore((s) => s.screen);

  const renderScreen = () => {
    switch (screen) {
      case 'splash':       return <SplashScreen />;
      case 'home':         return <HomeScreen />;
      case 'category_select': return <CategorySelect />;
      case 'level_intro':  return <LevelIntroScreen />;
      case 'level1':       return <Level1Screen />;
      case 'level2':       return <Level2Screen />;
      case 'level3':       return <Level3Screen />;
      case 'level4':       return <Level4Screen />;
      case 'level5':       return <Level5Screen />;
      case 'celebration':  return <CelebrationScreen />;
      case 'teacher_panel': return <TeacherPanelScreen />;
      default:             return <SplashScreen />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      {renderScreen()}
    </View>
  );
}
