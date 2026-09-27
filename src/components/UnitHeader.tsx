import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from './ProgressBar';

export interface UnitHeaderProps {
  unitNumber: number;
  unitNumberAr: string;
  titleEn: string;
  titleAr: string;
  iconName: keyof typeof Ionicons.glyphMap;
  progressDone: number;
  progressTotal: number;
}

export function UnitHeader({ unitNumber, unitNumberAr, titleEn, titleAr, iconName, progressDone, progressTotal }: UnitHeaderProps) {
  const pct = progressTotal > 0 ? progressDone / progressTotal : 0;
  return (
    <View className="rounded-2xl p-space-md mx-margin overflow-hidden"
      style={{ backgroundColor: '#2D4059',
        shadowColor: '#1A2636', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1, shadowRadius: 0 }}>
      <View className="flex-row items-start justify-between">
        <View className="gap-0.5 flex-1">
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="checkmark-circle" size={18} color="#FFD460" />
            <Text className="font-label-md text-label-md uppercase"
              style={{ color: '#FFD460', fontWeight: '800' }}>
              Unit {unitNumber} • {unitNumberAr}
            </Text>
          </View>
          <Text className="font-headline text-headline-lg text-white mt-0.5" style={{ fontWeight: '800' }}>{titleEn}</Text>
          <Text className="font-arabic text-body-md" style={{ color: '#FFFFFFE6', fontWeight: '700' }}>{titleAr}</Text>
        </View>
        <View className="w-12 h-12 rounded-2xl items-center justify-center"
          style={{ backgroundColor: '#FFFFFF1A', borderWidth: 1, borderColor: '#FFFFFF26' }}>
          <Ionicons name={iconName} size={28} color="#FFD460" />
        </View>
      </View>

      <View className="mt-4 pt-2 border-t" style={{ borderColor: '#FFFFFF1A' }}>
        <View className="flex-row items-center justify-between">
          <Text className="font-label-md text-label-md" style={{ color: '#FFFFFFE6' }}>
            Progress: {progressDone} of {progressTotal} Steps
          </Text>
          <Text className="font-label-md text-label-md" style={{ color: '#FFD460', fontWeight: '800' }}>
            {Math.round(pct * 100)}%
          </Text>
        </View>
        <View className="mt-1.5">
          <ProgressBar value={pct} fill="#F07B3F" track="#0003" />
        </View>
      </View>
    </View>
  );
}

export default UnitHeader;