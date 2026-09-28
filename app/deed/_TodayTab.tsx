import { useState } from 'react';
import { Pressable, View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button3D } from '@/components/Button3D';
import { useColors } from '@/theme/tokens';

export interface TodayTabProps {
  deedTitle: string;
  deedTitleAr: string;
  categoryTitle: string;
  xp: number;
  notes: string;
  onChangeNotes: (next: string) => void;
  onComplete: () => void;
}

export function TodayTab({ deedTitle, deedTitleAr, categoryTitle, xp, notes, onChangeNotes, onComplete }: TodayTabProps) {
  const colors = useColors();
  const [count, setCount] = useState(1);
  const [done, setDone] = useState(false);
  const total = count * xp;

  return (
    <View className="gap-5 px-gutter pt-3">
      <View className="flex-row items-center justify-between">
        <View className="px-3 py-1 rounded-full flex-row items-center gap-1.5"
          style={{ backgroundColor: '#F07B3F26', borderWidth: 1, borderColor: '#F07B3F33' }}>
          <Ionicons name="chatbubbles" size={15} color="#F07B3F" />
          <Text className="font-label-sm text-label-sm"
            style={{ color: '#F07B3F', fontWeight: '800' }}>{categoryTitle}</Text>
        </View>
        <View className="px-3 py-1 rounded-full flex-row items-center gap-1"
          style={{ backgroundColor: '#FFD460', borderWidth: 1, borderColor: '#FFD460CC' }}>
          <Ionicons name="star" size={15} color="#1D2B3D" />
          <Text className="font-label-sm text-label-sm"
            style={{ color: '#1D2B3D', fontWeight: '800' }}>+{xp} XP</Text>
        </View>
      </View>

      <View className="rounded-2xl p-6 items-center"
        style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}>
        <View className="relative mb-4">
          <View className="w-24 h-24 rounded-3xl items-center justify-center"
            style={{ backgroundColor: '#EA5455',
              shadowColor: '#C83E40', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
            <Ionicons name="chatbox" size={48} color="#FFFFFF" />
          </View>
          <View className="absolute -top-2 -right-2 w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: '#FFD460', borderWidth: 2, borderColor: '#FFFFFF' }}>
            <Ionicons name="sparkles" size={18} color="#1D2B3D" />
          </View>
        </View>

        <Text className="font-headline text-headline-md text-center" style={{ color: '#1D2B3D' }}>{deedTitle}</Text>
        <Text className="font-arabic text-body-md text-center mt-1" dir="auto"
          style={{ color: '#EA5455', fontWeight: '700' }}>{deedTitleAr}</Text>
        <Text className="font-body text-body-sm text-center max-w-xs mt-3 leading-6"
          style={{ color: '#5B6E85' }}>
          Take 30 seconds to send a heartfelt prayer or encouraging message.
        </Text>

        <View className="mt-4 flex-row items-center gap-2 flex-wrap justify-center">
          <View className="px-3 py-1 rounded-full flex-row items-center gap-1" style={{ backgroundColor: colors.surfaceLow }}>
            <Ionicons name="timer" size={14} color="#1D2B3D" />
            <Text className="font-label-sm text-label-sm" style={{ color: '#1D2B3D', fontWeight: '800' }}>Easy • &lt; 1 min</Text>
          </View>
          <View className="px-3 py-1 rounded-full flex-row items-center gap-1" style={{ backgroundColor: colors.surfaceLow }}>
            <Ionicons name="repeat" size={14} color="#1D2B3D" />
            <Text className="font-label-sm text-label-sm" style={{ color: '#1D2B3D', fontWeight: '800' }}>Repeatable Daily</Text>
          </View>
          <View className="px-3 py-1 rounded-full flex-row items-center gap-1" style={{ backgroundColor: '#1D2B3D' }}>
            <Ionicons name="checkmark-circle" size={14} color="#FFD460" />
            <Text className="font-label-sm text-label-sm text-white" style={{ fontWeight: '800' }}>Sunnah Habit</Text>
          </View>
        </View>
      </View>

      <View className="rounded-2xl p-4 gap-3"
        style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-headline text-headline-sm" style={{ color: '#1D2B3D' }}>Times performed today</Text>
            <Text className="font-body text-body-sm" style={{ color: '#5B6E85' }}>Multiply your reward</Text>
          </View>
          <Text className="font-label-md text-label-md px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: '#FFD46066', borderWidth: 1, borderColor: '#FFD46099', color: '#1D2B3D', fontWeight: '800' }}>
            +{total} XP
          </Text>
        </View>
        <View className="flex-row items-center justify-center gap-4">
          <Pressable
            accessibilityLabel="decrement"
            onPress={() => setCount(c => Math.max(1, c - 1))}
            className="w-14 h-14 rounded-2xl items-center justify-center"
            style={{ backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: colors.border }}>
            <Ionicons name="remove" size={24} color="#1D2B3D" />
          </Pressable>
          <View className="w-24 h-14 rounded-2xl items-center justify-center"
            style={{ backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: colors.border }}>
            <Text className="font-headline text-headline-lg" style={{ color: '#1D2B3D', fontWeight: '800' }}>{count}</Text>
          </View>
          <Pressable
            accessibilityLabel="increment"
            onPress={() => setCount(c => Math.min(50, c + 1))}
            className="w-14 h-14 rounded-2xl items-center justify-center"
            style={{ backgroundColor: '#F07B3F',
              shadowColor: '#CF6027', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0 }}>
            <Ionicons name="add" size={26} color="#FFFFFF" />
          </Pressable>
        </View>
        <View>
          <View className="flex-row items-center justify-between mb-1">
            <Text className="font-label-sm text-label-sm" style={{ color: '#1D2B3D', fontWeight: '800' }}>
              Personal Reflection (Optional)
            </Text>
            <Text className="font-body-sm text-body-sm" style={{ color: '#5B6E85' }}>Private to you</Text>
          </View>
          <TextInput
            value={notes}
            onChangeText={onChangeNotes}
            placeholder="Add a personal note (optional)..."
            placeholderTextColor="#5B6E8599"
            multiline numberOfLines={2}
            className="p-3 rounded-xl"
            style={{ backgroundColor: colors.surfaceLow, borderWidth: 1, borderColor: colors.border, color: '#1D2B3D', textAlignVertical: 'top' }}
          />
        </View>
      </View>

      <View>
        <Button3D
          label={`Mark as Completed (+${total} XP)`}
          variant="coral"
          onPress={() => { setDone(true); onComplete(); }}
          leadingIcon={<Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />}
          trailingIcon={<Ionicons name="arrow-forward" size={20} color="#FFFFFF" />}
        />
        {done ? (
          <View className="mt-2 rounded-xl p-3.5 flex-row items-center justify-between"
            style={{ backgroundColor: '#FFD460', borderWidth: 1, borderColor: '#FFD460E5' }}>
            <View className="flex-row items-center gap-2">
              <Ionicons name="sparkles" size={24} color="#1D2B3D" />
              <Text className="font-headline text-label-sm" style={{ color: '#1D2B3D' }}>Barakallahu Feek! Deed logged for today.</Text>
            </View>
          </View>
        ) : null}
      </View>

      <View className="rounded-2xl p-4 gap-2"
        style={{ backgroundColor: colors.surfaceLowest, borderWidth: 1, borderColor: colors.border }}>
        <Text className="font-label-sm text-label-sm uppercase"
          style={{ color: '#F07B3F', fontWeight: '800' }}>
          Prophetic Wisdom
        </Text>
        <Text className="font-body text-body-sm italic" style={{ color: '#1D2B3DCC' }}>
          "No Muslim servant prays for his brother behind his back, but that the angel says: 'And to you the same.'"
        </Text>
      </View>
    </View>
  );
}

export default TodayTab;