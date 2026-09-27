import { Modal, Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button3D } from './Button3D';

export interface ActiveDeedSheetProps {
  visible: boolean;
  deedTitle: string;
  deedTitleAr?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  rewardXp: number;
  rewardLabel?: string;
  hadith?: string;
  onClose: () => void;
  onComplete: () => void;
}

export function ActiveDeedSheet({
  visible, deedTitle, deedTitleAr, iconName, rewardXp, rewardLabel,
  hadith, onClose, onComplete,
}: ActiveDeedSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable accessibilityLabel="close-overlay" onPress={onClose}
        style={{ flex: 1, backgroundColor: '#2D405988', justifyContent: 'flex-end', padding: 16 }}>
        <Pressable onPress={() => {}}
          style={{ width: '100%', maxWidth: 380, alignSelf: 'center', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20 }}>
          <Pressable accessibilityLabel="close" onPress={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: '#EFF4FF' }}>
            <Ionicons name="close" size={20} color="#2D4059" />
          </Pressable>

          <View className="flex-row items-center gap-3">
            <View className="w-14 h-14 rounded-2xl items-center justify-center"
              style={{ backgroundColor: '#EA5455',
                shadowColor: '#C83E40', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0 }}>
              <Ionicons name={iconName} size={32} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="font-label-sm text-label-sm uppercase" style={{ color: '#EA5455', fontWeight: '800' }}>
                Today's Recommended Deed
              </Text>
              <Text className="font-headline text-headline-md" style={{ color: '#1D2B3D' }}>{deedTitle}</Text>
              {deedTitleAr ? (
                <Text className="font-arabic text-body-sm" style={{ color: '#5B6E85' }} dir="auto">{deedTitleAr}</Text>
              ) : null}
            </View>
          </View>

          <View className="mt-4 p-3 rounded-xl flex-row items-center justify-between" style={{ backgroundColor: '#EFF4FF' }}>
            <View className="flex-row items-center gap-2">
              <Ionicons name="flash" size={20} color="#F07B3F" />
              <Text className="font-label-md text-label-md" style={{ color: '#1D2B3D', fontWeight: '800' }}>Reward</Text>
            </View>
            <Text className="font-label-md text-label-md px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: '#FFD460', fontWeight: '700' }}>
              +{rewardXp} XP{rewardLabel ? ` • ${rewardLabel}` : ''}
            </Text>
          </View>

          {hadith ? (
            <Text className="mt-3 font-body text-body-md" style={{ color: '#1D2B3DCC', lineHeight: 22 }}>{hadith}</Text>
          ) : null}

          <View className="mt-5">
            <Button3D label="Mark as Done" variant="coral" onPress={onComplete}
              leadingIcon={<Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default ActiveDeedSheet;