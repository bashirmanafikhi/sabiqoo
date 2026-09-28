import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export interface RoadmapPathSvgProps {
  paths: ReadonlyArray<{
    id: string;
    d: string;
    color: string;
    trackColor?: string;
    width?: number;
    trackWidth?: number;
    dashed?: boolean;
    dashArray?: string;
  }>;
  width?: number;
  height?: number;
}

export function RoadmapPathSvg({ paths, width = 400, height = 600 }: RoadmapPathSvgProps) {
  const all = useMemo(() => paths, [paths]);
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { zIndex: 0 }]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" fill="none">
        {all.map(p => (
          <React.Fragment key={p.id}>
            <Path d={p.d} stroke={p.trackColor ?? '#DCE9FF'}
              strokeLinecap="round" strokeLinejoin="round" strokeWidth={p.trackWidth ?? 14} />
            <Path d={p.d} stroke={p.color}
              strokeLinecap="round" strokeLinejoin="round" strokeWidth={p.width ?? 6}
              strokeDasharray={p.dashed ? (p.dashArray ?? '4 8') : undefined} />
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}

export default RoadmapPathSvg;