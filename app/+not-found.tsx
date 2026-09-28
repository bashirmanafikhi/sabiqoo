import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/theme/tokens';

export default function NotFoundScreen() {
  const colors = useColors();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <Ionicons name="alert-circle-outline" size={72} color={colors.textMuted} />
      <Text
        className="mt-4 text-2xl font-bold"
        style={{ color: colors.textPrimary }}
      >
        404
      </Text>
      <Text
        className="mt-2 text-base"
        style={{ color: colors.textMuted, textAlign: 'center' }}
      >
        {t('home.title')}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.cancel')}
        onPress={() => router.back()}
        style={{
          marginTop: 24,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: colors.navyDark,
          backgroundColor: colors.coral,
        }}
      >
        <Text className="text-base font-bold" style={{ color: colors.surfaceLowest }}>
          {t('common.cancel')}
        </Text>
      </Pressable>
    </View>
  );
}
