import { Dimensions } from 'react-native';

export const MODES = [
  { key: 'finances', label: 'Finances' },
  { key: 'workout', label: 'Workout' },
  { key: 'cooking', label: 'Cooking' }
];

// For semi-circle positioning
export const radius = 120;
export const centerX = Dimensions.get('window').width / 2;
export const centerY = 180;