import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MODES, radius, centerX, centerY } from '../utils/mode/constants';

// Import modules
import FinancesScreen from '../modules/mode/finances';
import WorkoutScreen from '../modules/mode/workout';
import CookingScreen from '../modules/mode/cooking';

const MODE_COMPONENTS = {
  finances: FinancesScreen,
  workout: WorkoutScreen,
  cooking: CookingScreen,
};

export default function ModeScreen({ navigation }) {
  const [showMenu, setShowMenu] = useState(false);
  const [defaultMode, setDefaultMode] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Listen for focus event (tab pressed)
    const unsubscribe = navigation.addListener('focus', async () => {
      const savedMode = await AsyncStorage.getItem('defaultMode');
      setDefaultMode(savedMode);
      if (!savedMode) {
        setShowMenu(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        setShowMenu(false);
      }
    });
    return unsubscribe;
  }, [navigation]);

  const selectMode = async (modeKey) => {
    await AsyncStorage.setItem('defaultMode', modeKey);
    setDefaultMode(modeKey);
    setShowMenu(false);
  };

  const changeMode = () => {
    setShowMenu(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const SelectedModule =
    defaultMode && MODE_COMPONENTS[defaultMode]
      ? MODE_COMPONENTS[defaultMode]
      : null;

  return (
    <View style={styles.container}>
      {defaultMode && !showMenu && SelectedModule ? (
        <>
          <SelectedModule />
          <TouchableOpacity onPress={changeMode} style={styles.changeBtn}>
            <Text style={{ color: 'white' }}>Change Mode</Text>
          </TouchableOpacity>
        </>
      ) : null}

      {showMenu && (
        <Animated.View style={[styles.semicircleContainer, { opacity: fadeAnim }]}>
          {/* The semi-circle */}
          <View style={styles.semicircle} />
          {/* The menu buttons */}
          {MODES.map((mode, i) => {
            const angle = (Math.PI / (MODES.length - 1)) * i - Math.PI;
            const x = centerX + radius * Math.cos(angle) - 40;
            const y = centerY + radius * Math.sin(angle) - 40;
            return (
              <TouchableOpacity
                key={mode.key}
                style={[styles.menuBtn, { position: 'absolute', left: x, top: y }]}
                onPress={() => selectMode(mode.key)}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{mode.label}</Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 22,
    marginTop: 16,
  },
  semicircleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 240,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  semicircle: {
    position: 'absolute',
    bottom: 0,
    width: 320,
    height: 160,
    borderTopLeftRadius: 160,
    borderTopRightRadius: 160,
    // backgroundColor: '#007AFF',
    alignSelf: 'center',
  },
  menuBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
