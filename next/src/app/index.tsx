import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { migrationPhases } from '@/constants/migration';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Expo Migration</Text>
          <Text style={styles.title}>WoWs Info Next</Text>
          <Text style={styles.subtitle}>
            Fresh Expo-first workspace for the long-term rewrite. Legacy native
            brownfield code stays isolated in the old app while screens and data
            modules move here incrementally.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Direction</Text>
          <Text style={styles.cardBody}>
            Source app: <Text style={styles.code}>wowsinfo/</Text>
          </Text>
          <Text style={styles.cardBody}>
            Target app: <Text style={styles.code}>next/</Text>
          </Text>
          <Text style={styles.cardBody}>
            Runtime: Expo SDK 55, React Native 0.83, React 19.2, Expo Router,
            Bun
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Migration Phases</Text>
          {migrationPhases.map(phase => (
            <View key={phase.title} style={styles.phaseRow}>
              <View style={[styles.badge, styles[phase.status]]}>
                <Text style={styles.badgeText}>{phase.status.toUpperCase()}</Text>
              </View>
              <View style={styles.phaseCopy}>
                <Text style={styles.phaseTitle}>{phase.title}</Text>
                <Text style={styles.phaseSummary}>{phase.summary}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Immediate Next Move</Text>
          <Text style={styles.cardBody}>
            Extract Expo-safe shared modules first: app constants, localization,
            storage, and API access. Then rebuild navigation route-by-route in
            Expo Router.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2efe6',
  },
  content: {
    padding: 24,
    gap: 20,
  },
  hero: {
    gap: 8,
    paddingTop: 8,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: '#7a4b1f',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1f2f25',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#3d4d42',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2f25',
  },
  card: {
    backgroundColor: '#fffaf0',
    borderRadius: 18,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e5d8bf',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2f25',
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 22,
    color: '#425248',
  },
  code: {
    fontFamily: 'monospace',
    color: '#7a4b1f',
  },
  phaseRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e6dcc9',
  },
  phaseCopy: {
    flex: 1,
    gap: 4,
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2f25',
  },
  phaseSummary: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4f5f55',
  },
  badge: {
    minWidth: 64,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#fff',
  },
  done: {
    backgroundColor: '#2f7d4c',
  },
  next: {
    backgroundColor: '#8b5e1a',
  },
  blocked: {
    backgroundColor: '#8a3333',
  },
});
