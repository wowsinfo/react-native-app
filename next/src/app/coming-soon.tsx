import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppPalette } from '@/constants/theme';

export default function ComingSoonScreen() {
  const router = useRouter();
  const { title } = useLocalSearchParams<{ title?: string }>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: title ?? 'Coming Soon',
        }}
      />
      <View style={styles.container}>
        <Text style={styles.eyebrow}>Route Not Migrated Yet</Text>
        <Text style={styles.title}>{title ?? 'This screen'}</Text>
        <Text style={styles.body}>
          The Expo rewrite is active, but this route has not been ported from
          the legacy app yet.
        </Text>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppPalette.appBackground,
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
    color: AppPalette.accent,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: AppPalette.text,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: AppPalette.muted,
  },
  button: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: AppPalette.accent,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: AppPalette.inverseText,
    fontSize: 15,
    fontWeight: '700',
  },
});
