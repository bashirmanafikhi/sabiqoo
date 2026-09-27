import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
  durationMs?: number;
}

export function Toast({ visible, message, onHide, durationMs = 3000 }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(onHide, durationMs);
    return () => clearTimeout(id);
  }, [visible, durationMs, onHide]);

  return (
    <View pointerEvents="none" style={{
      position: 'absolute', bottom: 80, left: 0, right: 0, alignItems: 'center', zIndex: 50,
      opacity: visible ? 1 : 0, transform: [{ translateY: visible ? 0 : 16 }],
    }}>
      <View className="flex-row items-center gap-2 max-w-xs px-4 py-2.5 rounded-full"
        style={{ backgroundColor: '#1D2B3D', borderWidth: 1, borderColor: '#FFFFFF1A' }}>
        <Ionicons name="information-circle" size={18} color="#FFD460" />
        <Text className="font-label-md text-label-md text-white" style={{ fontWeight: '700' }}>{message}</Text>
      </View>
    </View>
  );
}

export default Toast;