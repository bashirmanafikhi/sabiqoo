import { Modal, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button3D } from './Button3D';

export interface RewardChestModalProps {
  visible: boolean;
  bonusXp: number;
  hadith?: string;
  onClose: () => void;
}

export function RewardChestModal({ visible, bonusXp, hadith, onClose }: RewardChestModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center p-4" style={{ backgroundColor: '#2D405988' }}>
        <View className="w-full max-w-xs items-center p-5 rounded-3xl" style={{ backgroundColor: '#FFFFFF' }}>
          <View className="w-16 h-16 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: '#FFD460',
              shadowColor: '#D4A838', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
            <Ionicons name="gift" size={36} color="#1D2B3D" />
          </View>
          <Text className="font-headline text-headline-md" style={{ color: '#1D2B3D' }}>Daily Barakah Gift!</Text>
          <Text className="font-body text-body-md text-center mt-1" style={{ color: '#5B6E85' }}>
            You maintained a streak. Here is your daily motivational gift:
          </Text>
          {hadith ? (
            <View className="mt-3 p-3 w-full rounded-2xl" style={{ backgroundColor: '#EFF4FF' }}>
              <Text className="font-headline text-headline-sm" style={{ color: '#F07B3F', fontWeight: '800' }}>+{bonusXp} Bonus XP</Text>
              <Text className="font-body text-body-sm mt-0.5" style={{ color: '#5B6E85' }}>{hadith}</Text>
            </View>
          ) : null}
          <View className="mt-4 w-full">
            <Button3D label="Alhamdulillah!" variant="navy" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default RewardChestModal;