import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    backgroundColor: '#f2efe6',
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
    color: '#8b5e1a',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1f2f25',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#425248',
  },
  button: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#1f2f25',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
