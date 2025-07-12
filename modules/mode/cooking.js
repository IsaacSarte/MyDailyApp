import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CookingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cooking Module</Text>
      {/* Add Cooking-specific UI here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 24 }
});
