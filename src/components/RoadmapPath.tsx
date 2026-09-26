// Renders the curved bezier "road" between consecutive roadmap nodes, plus
// the nodes themselves, with nodes alternating left/right.
//
// The path is drawn with `react-native-svg` BezierPath so it actually
// looks like the Duolingo serpentine, not a series of disconnected dashes.
//
// Lanes are computed from the container width:
/**
 * Renders the curving, alternating roadmap path (SVG paths + Node components)
 * for one unit.
 */
import { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Node, type NodeState } from './Node';
import type { Deed } from '@/db/schema';
import { useColors } from '@/theme/tokens';

export interface RoadmapPathProps {
  deeds: Deed[];
  stateFor: (deedId: number) => NodeState;
  containerWidth: number;
  nodeSize?: number;
  onPressDeed: (deedId: number) => void;
}

/**
 * Bends a smooth Q-curve between two horizontal anchor points (x1, y) and
 * (x2, y). C-curve that bulges downward by `bulge` pixels.
 */
function curve(x1: number, x2: number, y: number, bulge: number): string {
  // Direction-aware control points so the curve always flows downward.
  const cx1 = x1 + (x2 - x1) * 0.5;
  const cx2 = x1 + (x2 - x1) * 0.5;
  return `M ${x1} ${y} C ${cx1} ${y + bulge} ${cx2} ${y + bulge} ${x2} ${y}`;
}

export function RoadmapPath({
  deeds,
  stateFor,
  containerWidth,
  nodeSize = 64,
  onPressDeed,
}: RoadmapPathProps) {
  const colors = useColors();

  // Compute lane centres. Two lanes: left-of-center and right-of-center.
  // The first node sits on the left, then alternates.
  const padding = 16;
  const innerW = Math.max(0, containerWidth - padding * 2);
  const laneLeft = padding + nodeSize / 2;
  const laneRight = innerW + padding - nodeSize / 2;
  const cy = nodeSize / 2; // node vertical centre within its 80x80 hit area

  // Pre-compute each node's (x, lane, state).
  const items = useMemo(
    () =>
      deeds.map((d, idx) => ({
        deed: d,
        state: stateFor(d.id),
        x: idx % 2 === 0 ? laneLeft : laneRight,
        side: (idx % 2 === 0 ? 'start' : 'end') as 'start' | 'end',
      })),
    [deeds, laneLeft, laneRight, stateFor],
  );

  // Build the SVG path strings between consecutive nodes.
  const segments = useMemo(() => {
    const out: { d: string; key: string; color: string }[] = [];
    for (let i = 0; i + 1 < items.length; i += 1) {
      const a = items[i];
      const b = items[i + 1];
      if (!a || !b) continue;
      const dash = a.state !== 'locked' && b.state !== 'locked'
        ? 0
        : a.deed.id;
      const color = dash ? colors.border : colors.brand;
      out.push({
        d: curve(a.x, b.x, cy, nodeSize),
        key: `${a.deed.id}-${b.deed.id}`,
        color,
      });
    }
    return out;
  }, [items, colors.border, colors.brand, cy, nodeSize]);

  const rowHeight = nodeSize + 40; // node hit area + curve bulge room

  return (
    <View
      style={{ height: rowHeight * Math.max(1, items.length), width: containerWidth }}
    >
      <Svg
        width={containerWidth}
        height={rowHeight * Math.max(1, items.length)}
        style={{ position: 'absolute', top: 0, start: 0, end: 0 }}
      >
        {segments.map(s => (
          <Path
            key={s.key}
            d={s.d}
            stroke={s.color}
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </Svg>
      {items.map((it, idx) => {
        const top = idx * rowHeight;
        return (
          <View
            key={it.deed.id}
            style={{
              position: 'absolute',
              top,
              start: it.side === 'start' ? 0 : undefined,
              end: it.side === 'end' ? 0 : undefined,
              width: nodeSize,
              height: nodeSize,
            }}
          >
            <Node
              state={it.state}
              deedId={it.deed.id}
              onPress={() => onPressDeed(it.deed.id)}
            />
          </View>
        );
      })}
    </View>
  );
}

export default RoadmapPath;

// Avoid unused-export lints
export const _curve = curve;
