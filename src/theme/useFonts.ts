import { useFonts as useEpilogueFonts, Epilogue_500Medium, Epilogue_600SemiBold, Epilogue_700Bold, Epilogue_800ExtraBold, Epilogue_900Black } from '@expo-google-fonts/epilogue';
import { useFonts as useJakartaFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts as useCairoFonts, Cairo_700Bold, Cairo_800ExtraBold, Cairo_900Black } from '@expo-google-fonts/cairo';

export function useAppFonts(): boolean {
  const [epilogueLoaded] = useEpilogueFonts({
    Epilogue_500Medium, Epilogue_600SemiBold, Epilogue_700Bold, Epilogue_800ExtraBold, Epilogue_900Black,
  });
  const [jakartaLoaded] = useJakartaFonts({
    PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold,
  });
  const [cairoLoaded] = useCairoFonts({
    Cairo_700Bold, Cairo_800ExtraBold, Cairo_900Black,
  });
  return !!(epilogueLoaded && jakartaLoaded && cairoLoaded);
}
