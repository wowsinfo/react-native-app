import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppPreferences } from '@/features/preferences/preferences-manager';

export default function ComingSoonScreen() {
  const router = useRouter();
  const { palette, tintColor, resolvedTheme, t } = useAppPreferences();
  const styles = createStyles(palette, tintColor);
  const { title } = useLocalSearchParams<{ title?: string }>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: title ?? t('coming_soon_title'),
        }}
      />
      <View style={styles.container}>
        <Text style={styles.eyebrow}>{t('coming_soon_title')}</Text>
        <Text style={styles.title}>{title ?? t('coming_soon_screen')}</Text>
        <Text style={styles.body}>{t('coming_soon_body')}</Text>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>{t('common_back_home')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createStyles(
  palette: ReturnType<typeof useAppPreferences>['palette'],
  tintColor: string,
) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: palette.appBackground,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 24,
      gap: 12,
    },
    eyebrow: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
      color: tintColor,
    },
    title: {
      fontSize: 32,
      fontWeight: '800',
      color: palette.text,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      color: palette.muted,
    },
    button: {
      marginTop: 8,
      alignSelf: 'flex-start',
      backgroundColor: tintColor,
      borderRadius: 999,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    buttonText: {
      color: palette.inverseText,
      fontSize: 15,
      fontWeight: '700',
    },
  });
}
