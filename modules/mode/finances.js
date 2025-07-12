import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FinancesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Finances Module</Text>
      {/* You can add Finances-specific UI here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 24 }
});
