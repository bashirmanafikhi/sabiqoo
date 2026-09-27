import { View } from 'react-native';

export interface ProgressBarProps {
  value: number;
  fill?: string;
  track?: string;
  height?: number;
  inset?: number;
  testID?: string;
}

export function ProgressBar({
  value, fill = '#F07B3F', track = '#0003', height = 12, inset = 2, testID,
}: ProgressBarProps) {
  const v = Math.max(0, Math.min(1, value));
  return (
    <View testID={testID} style={{
      width: '100%', height, borderRadius: 999,
      backgroundColor: track, overflow: 'hidden',
      padding: inset, borderWidth: 1, borderColor: '#FFFFFF10',
    }}>
      <View style={{
        height: height - inset * 2, borderRadius: 999,
        backgroundColor: fill, width: `${v * 100}%`,
      }} />
    </View>
  );
}

export default ProgressBar;