import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type NodeState = 'mastered' | 'completed' | 'available' | 'locked' | 'skipped';
export interface RoadmapNodeProps {
  state: NodeState;
  label: string;
  xp?: number;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
}

const SIZE = 64;
const BEVEL = 5;

const TOP = {
  mastered: '#FFD460', completed: '#FFD460', available: '#EA5455',
  locked: '#DCE9FF', skipped: '#DCE9FF',
} as const;

const BEVEL_COLOR = {
  mastered: '#D4A838', completed: '#D4A838', available: '#C83E40',
  locked: '#C5D4EC', skipped: '#C5D4EC',
} as const;

const ICON = {
  mastered:  { name: 'star',          fill: '#1D2B3D' },
  completed: { name: 'checkmark',     fill: '#1D2B3D' },
  available: { name: 'heart',         fill: '#FFFFFF' },
  locked:    { name: 'lock-closed',   fill: '#1D2B3D99' },
  skipped:   { name: 'eye-off',       fill: '#1D2B3DAA' },
};

export function RoadmapNode({ state, label, xp, onPress, disabled, testID }: RoadmapNodeProps) {
  const locked = state === 'locked' || disabled;
  const ic = ICON[state];

  const body = (
    <View className="items-center" testID={testID}>
      {state === 'available' && xp != null ? (
        <View className="mb-1 flex-row items-center gap-1 px-space-sm py-0.5 rounded-full"
          style={{ backgroundColor: '#EA5455' }}>
          <Ionicons name="flash" size={14} color="#FFD460" />
          <Text className="font-label-md text-label-md text-white" style={{ fontWeight: '800' }}>+{xp} XP</Text>
        </View>
      ) : null}

      <View style={{ width: SIZE, height: SIZE + BEVEL }} testID={`${testID}-circle`}>
        <View aria-hidden style={{
          position: 'absolute', top: BEVEL, left: 0, right: 0, bottom: 0,
          backgroundColor: BEVEL_COLOR[state], borderRadius: 999,
        }} />
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: BEVEL,
          backgroundColor: TOP[state], borderRadius: 999,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Ionicons name={ic.name as any} size={state === 'available' ? 28 : 26} color={ic.fill} />
          {state === 'mastered' ? (
            <View style={{
              position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: 11,
              backgroundColor: '#EA5455', alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons name="flame" size={12} color="#FFFFFF" />
            </View>
          ) : null}
          {state === 'available' ? (
            <View style={{
              position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9,
              backgroundColor: '#FFD460', alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons name="play" size={10} color="#1D2B3D" />
            </View>
          ) : null}
        </View>
      </View>

      <View className="mt-2 px-space-sm py-0.5 rounded-full"
        style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#1D2B3D1A' }}>
        <Text className="font-label-sm text-label-sm"
          style={{ color: state === 'locked' ? '#1D2B3D99' : '#1D2B3D', fontWeight: '700' }}
          numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );

  if (locked) return <View accessibilityLabel={label}>{body}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label}
      accessibilityState={{ disabled: locked }} onPress={onPress} hitSlop={6}
      testID={testID ? `${testID}-pressable` : undefined}>
      {body}
    </Pressable>
  );
}

export default RoadmapNode;