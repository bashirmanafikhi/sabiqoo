import { View, Text } from 'react-native';

export interface HeatDay { day: number; count: number }
export interface HeatmapGridProps {
  days: HeatDay[];
  weekStart?: 0 | 1;
}

const BUCKETS = [
  { max: 0, bg: '#DCE9FF', fg: '#1D2B3D99' },
  { max: 1, bg: '#FFD46099', fg: '#1D2B3D' },
  { max: 3, bg: '#F07B3F', fg: '#FFFFFF' },
  { max: 4, bg: '#EA5455', fg: '#FFFFFF' },
  { max: Infinity, bg: '#1D2B3D', fg: '#FFD460' },
];

export function bucketFor(count: number) {
  for (const b of BUCKETS) if (count <= b.max) return b;
  return BUCKETS[BUCKETS.length - 1];
}

export function HeatmapGrid({ days, weekStart = 1 }: HeatmapGridProps) {
  const labels = weekStart === 1 ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const rows = Math.ceil(days.length / 7);
  return (
    <View>
      <View className="flex-row" style={{ gap: 6 }}>
        {labels.map((l, i) => (
          <Text key={i} className="flex-1 text-center font-label-sm text-label-sm"
            style={{ color: '#1D2B3DBB', fontWeight: '800' }}>{l}</Text>
        ))}
      </View>
      <View className="gap-1.5 pt-1">
        {Array.from({ length: rows }).map((_, row) => (
          <View key={row} className="flex-row" style={{ gap: 6 }}>
            {days.slice(row * 7, row * 7 + 7).map((d, col) => {
              const b = bucketFor(d.count);
              if (!b) return null;
              return (
                <View key={`${row}-${col}`} testID={`heat-tile-${d.count}`}
                  className="flex-1 h-10 rounded-xl items-center justify-center"
                  style={{ backgroundColor: b.bg }}>
                  <Text className="font-label-sm text-label-sm"
                    style={{ color: b.fg, fontWeight: '800' }}>{d.count > 0 ? d.count : ''}</Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

export default HeatmapGrid;
