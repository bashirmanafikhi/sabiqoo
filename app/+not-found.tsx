import { Pressable, Text, View } from 'react-native';
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
      <Text className="font-headline text-headline-lg" style={{ color: colors.text }}>
        {t('notFound.title')}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('notFound.back')}
        onPress={() => router.replace('/')}
        className="mt-6 px-8 py-3.5 rounded-2xl"
        style={{ backgroundColor: colors.coralFill }}
      >
        <Text className="font-label-lg text-label-lg" style={{ color: colors.onCoral, fontWeight: '800' }}>
          {t('notFound.back')}
        </Text>
      </Pressable>
    </View>
  );
}
