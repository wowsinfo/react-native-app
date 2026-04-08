import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ReactNode } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  apiLanguageOptions,
  appLanguageOptions,
  defaultSettingsState,
  gameServerOptions,
  getTintValue,
  settingsLinks,
  tintOptions,
  type ChoiceOption,
} from '@/features/settings/content';
import { openUrl } from '@/lib/platform-actions';

type SettingsActionRowProps = {
  title: string;
  description?: string;
  accentColor: string;
  onPress?: () => void;
  trailing?: ReactNode;
};

type ChoiceGroupProps<T extends string> = {
  label: string;
  value: T;
  options: ChoiceOption<T>[];
  accentColor: string;
  onChange: (value: T) => void;
};

export default function SettingsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const compact = width < 820;
  const [settings, setSettings] = useState(defaultSettingsState);
  const [showTintPicker, setShowTintPicker] = useState(false);
  const tintColor = getTintValue(settings.tint);

  function updateSetting<K extends keyof typeof defaultSettingsState>(
    key: K,
    value: (typeof defaultSettingsState)[K],
  ) {
    setSettings(current => ({
      ...current,
      [key]: value,
    }));
  }

  function showPendingMessage(title: string, message: string) {
    Alert.alert(title, message);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: '#f7f1e4',
          },
          headerTintColor: '#1f2f25',
          headerShadowVisible: false,
        }}
      />
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.heroCard, { borderColor: tintColor }]}>
          <Text style={[styles.heroEyebrow, { color: tintColor }]}>Settings</Text>
          <Text style={styles.heroTitle}>Legacy layout, Expo-safe controls</Text>
          <Text style={styles.heroBody}>
            This route keeps the original grouped-list structure while dropping
            the old native dependencies. Preference persistence and live theming
            will be wired in after the shared data layer is migrated.
          </Text>
        </View>

        <SettingsSection
          title="API Settings"
          subtitle="Keep server and language choices close to the original app."
        >
          <ChoiceGroup
            label="Game Server"
            value={settings.server}
            options={gameServerOptions}
            accentColor={tintColor}
            onChange={value => updateSetting('server', value)}
          />
          <ChoiceGroup
            label="API Language"
            value={settings.apiLanguage}
            options={apiLanguageOptions}
            accentColor={tintColor}
            onChange={value => updateSetting('apiLanguage', value)}
          />
          <ChoiceGroup
            label="App Language"
            value={settings.appLanguage}
            options={appLanguageOptions}
            accentColor={tintColor}
            onChange={value => updateSetting('appLanguage', value)}
          />
          <Pressable
            style={[styles.blockButton, { backgroundColor: tintColor }]}
            onPress={() =>
              showPendingMessage(
                'Update Data',
                'Game data refresh is not wired in yet. This button is reserved for the Expo data sync flow.',
              )
            }
          >
            <Text style={styles.blockButtonLabel}>Update Game Data</Text>
          </Pressable>
        </SettingsSection>

        <SettingsSection
          title="App Settings"
          subtitle="The rows and tint selector mirror the current production screen."
        >
          <SettingsActionRow
            title="Dark Mode"
            description="Preview-only toggle until the shared theme store is migrated."
            accentColor={tintColor}
            onPress={() => updateSetting('darkMode', !settings.darkMode)}
            trailing={
              <Switch
                value={settings.darkMode}
                thumbColor="#fffdf8"
                trackColor={{ false: '#d7cfbf', true: tintColor }}
                onValueChange={value => updateSetting('darkMode', value)}
              />
            }
          />
          <SettingsActionRow
            title="Theme Colour"
            description="Pick the accent tint used by this Expo route."
            accentColor={tintColor}
            onPress={() => setShowTintPicker(true)}
            trailing={
              <View style={[styles.tintPreview, { backgroundColor: tintColor }]} />
            }
          />
          <SettingsActionRow
            title="Swap Bottom Buttons"
            description="Reserved for the battle tools layout that still needs migration."
            accentColor={tintColor}
            onPress={() => updateSetting('swapButtons', !settings.swapButtons)}
            trailing={
              <Switch
                value={settings.swapButtons}
                thumbColor="#fffdf8"
                trackColor={{ false: '#d7cfbf', true: tintColor }}
                onValueChange={value => updateSetting('swapButtons', value)}
              />
            }
          />
        </SettingsSection>

        <SettingsSection
          title="WoWs Info"
          subtitle="Keep the same support and release links."
        >
          <SettingsActionRow
            title="Send Feedback"
            description="Email the developer directly."
            accentColor={tintColor}
            onPress={() => void openUrl(settingsLinks.developer)}
          />
          <SettingsActionRow
            title="Report Issue"
            description={settingsLinks.reportIssue}
            accentColor={tintColor}
            onPress={() => void openUrl(settingsLinks.reportIssue)}
          />
          <SettingsActionRow
            title="Check for Update"
            description="Expo-native update checks will be added after EAS Update is configured."
            accentColor={tintColor}
            onPress={() =>
              showPendingMessage(
                'Check for Update',
                'Update checks are not connected yet in the Expo app.',
              )
            }
          />
        </SettingsSection>

        <SettingsSection
          title="Open Source"
          subtitle="Project links preserved during the rewrite."
        >
          <SettingsActionRow
            title="GitHub"
            description={settingsLinks.github}
            accentColor={tintColor}
            onPress={() => void openUrl(settingsLinks.github)}
          />
          <SettingsActionRow
            title="Licences"
            description="The dedicated licences screen has not been ported yet."
            accentColor={tintColor}
            onPress={() =>
              router.push({
                pathname: '/coming-soon',
                params: { title: 'Licences' },
              })
            }
          />
        </SettingsSection>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={showTintPicker}
        onRequestClose={() => setShowTintPicker(false)}
      >
        <Pressable
          style={styles.modalScrim}
          onPress={() => setShowTintPicker(false)}
        >
          <Pressable
            style={[styles.modalCard, compact && styles.modalCardCompact]}
            onPress={() => null}
          >
            <Text style={styles.modalTitle}>Theme Colour</Text>
            <Text style={styles.modalBody}>
              This matches the old tint picker, but stays local to the Expo route
              until settings persistence is moved over.
            </Text>
            <View style={styles.tintGrid}>
              {tintOptions.map(option => {
                const active = option.key === settings.tint;
                return (
                  <Pressable
                    key={option.key}
                    style={[
                      styles.tintOption,
                      active && styles.tintOptionActive,
                      { borderColor: active ? option.value : '#e4d7bf' },
                    ]}
                    onPress={() => {
                      updateSetting('tint', option.key);
                      setShowTintPicker(false);
                    }}
                  >
                    <View
                      style={[styles.tintSwatch, { backgroundColor: option.value }]}
                    />
                    <Text style={styles.tintOptionLabel}>{option.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function SettingsSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function ChoiceGroup<T extends string>({
  label,
  value,
  options,
  accentColor,
  onChange,
}: ChoiceGroupProps<T>) {
  const currentLabel = options.find(option => option.value === value)?.label ?? value;

  return (
    <View style={styles.choiceGroup}>
      <Text style={styles.choiceLabel}>
        {label}{' '}
        <Text style={[styles.choiceValue, { color: accentColor }]}>
          - {currentLabel}
        </Text>
      </Text>
      <View style={styles.choiceRow}>
        {options.map(option => {
          const active = option.value === value;
          return (
            <Pressable
              key={option.value}
              style={[
                styles.choiceChip,
                active && {
                  backgroundColor: accentColor,
                  borderColor: accentColor,
                },
              ]}
              onPress={() => onChange(option.value)}
            >
              <Text
                style={[
                  styles.choiceChipLabel,
                  active && styles.choiceChipLabelActive,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function SettingsActionRow({
  title,
  description,
  accentColor,
  onPress,
  trailing,
}: SettingsActionRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionRow,
        pressed && onPress ? styles.actionRowPressed : null,
      ]}
      onPress={onPress}
    >
      <View style={styles.actionCopy}>
        <Text style={styles.actionTitle}>{title}</Text>
        {description ? <Text style={styles.actionBody}>{description}</Text> : null}
      </View>
      <View style={styles.actionTrailing}>
        {trailing ?? (
          <Text style={[styles.actionArrow, { color: accentColor }]}>{'>'}</Text>
        )}
      </View>
    </Pressable>
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
  heroCard: {
    backgroundColor: '#fffaf0',
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    gap: 8,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2f25',
  },
  heroBody: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4a5a50',
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    alignItems: 'center',
    gap: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2f25',
    textAlign: 'center',
  },
  sectionSubtitle: {
    maxWidth: 620,
    fontSize: 13,
    lineHeight: 19,
    color: '#5b675f',
    textAlign: 'center',
  },
  sectionBody: {
    backgroundColor: '#fffaf0',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5d8bf',
    overflow: 'hidden',
  },
  choiceGroup: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#efe5d3',
    gap: 12,
  },
  choiceLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2f25',
  },
  choiceValue: {
    fontWeight: '800',
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choiceChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d6c6a7',
    backgroundColor: '#f8f1e3',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  choiceChipLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5f4a23',
  },
  choiceChipLabelActive: {
    color: '#fffdf8',
  },
  blockButton: {
    margin: 18,
    marginTop: 2,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  blockButtonLabel: {
    color: '#fffdf8',
    fontSize: 15,
    fontWeight: '800',
  },
  actionRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#efe5d3',
  },
  actionRowPressed: {
    backgroundColor: '#f5eee0',
  },
  actionCopy: {
    flex: 1,
    gap: 4,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2f25',
  },
  actionBody: {
    fontSize: 13,
    lineHeight: 18,
    color: '#5b675f',
  },
  actionTrailing: {
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  actionArrow: {
    fontSize: 28,
    lineHeight: 28,
    fontWeight: Platform.OS === 'web' ? '700' : '400',
  },
  tintPreview: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#f9f4ea',
  },
  modalScrim: {
    flex: 1,
    backgroundColor: 'rgba(24, 28, 22, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 620,
    borderRadius: 20,
    backgroundColor: '#fffaf0',
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: '#e5d8bf',
  },
  modalCardCompact: {
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2f25',
  },
  modalBody: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5b675f',
  },
  tintGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 8,
  },
  tintOption: {
    width: '31%',
    minWidth: 130,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: '#fff',
    padding: 12,
    gap: 10,
  },
  tintOptionActive: {
    backgroundColor: '#f8f1e3',
  },
  tintSwatch: {
    height: 34,
    borderRadius: 10,
  },
  tintOptionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2f25',
  },
});
