import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MODES, radius, centerX, centerY } from '../utils/mode/constants';

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

  return (
    <View style={styles.container}>
      {defaultMode && !showMenu ? (
        <>
          <Text style={styles.modeText}>
            {MODES.find(m => m.key === defaultMode)?.label} Mode
          </Text>
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
            const angle = (Math.PI / (MODES.length - 1)) * i - Math.PI; // Distribute evenly across semi-circle
            const x = centerX + radius * Math.cos(angle) - 40; // 40 is half button size
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
  modeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: -60,
  },
  changeBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 22,
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
