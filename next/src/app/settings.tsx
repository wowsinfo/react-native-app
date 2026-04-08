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
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  apiLanguageOptions,
  defaultSettingsState,
  tintOptions,
  type ChoiceOption,
} from '@/features/settings/content';
import {
  useAppPreferences,
  type AppLanguagePreference,
  type ThemeMode,
} from '@/features/preferences/preferences-manager';
import { getServerOptions } from '@/features/home/content';
import { openUrl } from '@/lib/platform-actions';
import { settingsLinks } from '@/features/settings/content';

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
  const {
    themeMode,
    setThemeMode,
    tintKey,
    setTintKey,
    tintColor,
    appLanguage,
    setAppLanguage,
    palette,
    resolvedTheme,
    t,
  } = useAppPreferences();
  const styles = createStyles(palette);
  const gameServerOptions = getServerOptions(t);
  const [showTintPicker, setShowTintPicker] = useState(false);
  const [server, setServer] = useState(defaultSettingsState.server);
  const [apiLanguage, setApiLanguage] = useState(defaultSettingsState.apiLanguage);
  const [swapButtons, setSwapButtons] = useState(defaultSettingsState.swapButtons);

  const themeModeOptions: ChoiceOption<ThemeMode>[] = [
    { value: 'system', label: t('theme_mode_system') },
    { value: 'light', label: t('common_light') },
    { value: 'dark', label: t('common_dark') },
  ];

  const appLanguageOptions: ChoiceOption<AppLanguagePreference>[] = [
    { value: 'system', label: t('localisation_system') },
    { value: 'en', label: t('language_name_en') },
    { value: 'ja', label: t('language_name_ja') },
    { value: 'zh', label: t('language_name_zh') },
    { value: 'zh-hant', label: t('language_name_zh_hant') },
  ];

  const localizedApiLanguageOptions: ChoiceOption<(typeof apiLanguageOptions)[number]['value']>[] = [
    { value: 'en', label: t('language_name_en') },
    { value: 'ja', label: t('language_name_ja') },
    { value: 'zh-cn', label: t('language_name_zh') },
    { value: 'zh-tw', label: t('language_name_zh_hant') },
  ];

  function showPendingMessage(title: string, message: string) {
    Alert.alert(title, message);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: t('settings_title'),
        }}
      />
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.heroCard, { borderColor: tintColor }]}>
          <Text style={[styles.heroEyebrow, { color: tintColor }]}>{t('settings_title')}</Text>
          <Text style={styles.heroTitle}>{t('settings_subtitle')}</Text>
          <Text style={styles.heroBody}>{t('settings_body')}</Text>
        </View>

        <SettingsSection
          title={t('settings_api_title')}
          subtitle={t('settings_api_subtitle')}
        >
          <ChoiceGroup
            label={t('settings_game_server')}
            value={server}
            options={gameServerOptions}
            accentColor={tintColor}
            onChange={setServer}
          />
          <ChoiceGroup
            label={t('settings_api_language')}
            value={apiLanguage}
            options={localizedApiLanguageOptions}
            accentColor={tintColor}
            onChange={setApiLanguage}
          />
          <ChoiceGroup
            label={t('settings_app_language')}
            value={appLanguage}
            options={appLanguageOptions}
            accentColor={tintColor}
            onChange={setAppLanguage}
          />
          <Pressable
            style={[styles.blockButton, { backgroundColor: tintColor }]}
            onPress={() =>
              showPendingMessage(t('settings_update_data'), t('settings_update_data_unavailable'))
            }
          >
            <Text style={styles.blockButtonLabel}>{t('settings_update_data')}</Text>
          </Pressable>
        </SettingsSection>

        <SettingsSection
          title={t('settings_appearance_title')}
          subtitle={t('settings_appearance_subtitle')}
        >
          <ChoiceGroup
            label={t('settings_theme_mode')}
            value={themeMode}
            options={themeModeOptions}
            accentColor={tintColor}
            onChange={setThemeMode}
          />
          <SettingsActionRow
            title={t('common_theme_colour')}
            description={t('settings_theme_colour_description')}
            accentColor={tintColor}
            onPress={() => setShowTintPicker(true)}
            trailing={<View style={[styles.tintPreview, { backgroundColor: tintColor }]} />}
          />
          <SettingsActionRow
            title={t('settings_swap_buttons')}
            description={t('settings_swap_buttons_description')}
            accentColor={tintColor}
            onPress={() => setSwapButtons(!swapButtons)}
            trailing={
              <Text style={styles.trailingValue}>
                {swapButtons ? t('common_on') : t('common_off')}
              </Text>
            }
          />
        </SettingsSection>

        <SettingsSection
          title={t('settings_wows_info_title')}
          subtitle={t('settings_wows_info_subtitle')}
        >
          <SettingsActionRow
            title={t('settings_send_feedback')}
            description={t('settings_send_feedback_desc')}
            accentColor={tintColor}
            onPress={() => void openUrl(settingsLinks.developer)}
          />
          <SettingsActionRow
            title={t('settings_report_issue')}
            description={settingsLinks.reportIssue}
            accentColor={tintColor}
            onPress={() => void openUrl(settingsLinks.reportIssue)}
          />
          <SettingsActionRow
            title={t('settings_check_update')}
            description={t('settings_check_update_desc')}
            accentColor={tintColor}
            onPress={() =>
              showPendingMessage(t('settings_check_update'), t('settings_check_update_unavailable'))
            }
          />
        </SettingsSection>

        <SettingsSection
          title={t('settings_open_source_title')}
          subtitle={t('settings_open_source_subtitle')}
        >
          <SettingsActionRow
            title={t('settings_github')}
            description={settingsLinks.github}
            accentColor={tintColor}
            onPress={() => void openUrl(settingsLinks.github)}
          />
          <SettingsActionRow
            title={t('settings_licences')}
            description={t('settings_licences_desc')}
            accentColor={tintColor}
            onPress={() =>
              router.push({
                pathname: '/coming-soon',
                params: { title: t('settings_licences') },
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
        <Pressable style={styles.modalScrim} onPress={() => setShowTintPicker(false)}>
          <Pressable
            style={[styles.modalCard, compact && styles.modalCardCompact]}
            onPress={() => null}
          >
            <Text style={styles.modalTitle}>{t('settings_tint_picker_title')}</Text>
            <Text style={styles.modalBody}>{t('settings_tint_picker_body')}</Text>
            <View style={styles.tintGrid}>
              {tintOptions.map(option => {
                const active = option.key === tintKey;
                return (
                  <Pressable
                    key={option.key}
                    style={[
                      styles.tintOption,
                      active && styles.tintOptionActive,
                      { borderColor: active ? option.value : palette.border },
                    ]}
                    onPress={() => {
                      setTintKey(option.key);
                      setShowTintPicker(false);
                    }}
                  >
                    <View style={[styles.tintSwatch, { backgroundColor: option.value }]} />
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
  const { palette } = useAppPreferences();

  return (
    <View style={{ gap: 10 }}>
      <View style={{ alignItems: 'center', gap: 4 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '800',
            color: palette.text,
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              maxWidth: 620,
              fontSize: 13,
              lineHeight: 19,
              color: palette.muted,
              textAlign: 'center',
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View>{children}</View>
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
  const { palette } = useAppPreferences();
  const styles = createStyles(palette);
  const currentLabel = options.find(option => option.value === value)?.label ?? value;

  return (
    <View style={styles.choiceGroup}>
      <Text style={styles.choiceLabel}>
        {label}{' '}
        <Text style={[styles.choiceValue, { color: accentColor }]}>- {currentLabel}</Text>
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
  const { palette } = useAppPreferences();
  const styles = createStyles(palette);

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
        {trailing ?? <Text style={[styles.actionArrow, { color: accentColor }]}>{'>'}</Text>}
      </View>
    </Pressable>
  );
}

function createStyles(
  palette: ReturnType<typeof useAppPreferences>['palette'],
) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: palette.appBackground,
    },
    content: {
      padding: 24,
      gap: 20,
    },
    heroCard: {
      backgroundColor: palette.surface,
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
      color: palette.text,
    },
    heroBody: {
      fontSize: 15,
      lineHeight: 22,
      color: palette.muted,
    },
    choiceGroup: {
      paddingHorizontal: 18,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: palette.borderSoft,
      gap: 12,
      backgroundColor: palette.surface,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: palette.border,
    },
    choiceLabel: {
      fontSize: 15,
      fontWeight: '700',
      color: palette.text,
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
      borderColor: palette.border,
      backgroundColor: palette.surfaceAlt,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    choiceChipLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: palette.text,
    },
    choiceChipLabelActive: {
      color: palette.inverseText,
    },
    blockButton: {
      margin: 18,
      marginTop: 2,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: 'center',
    },
    blockButtonLabel: {
      color: palette.inverseText,
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
      borderBottomColor: palette.borderSoft,
      backgroundColor: palette.surface,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: palette.border,
    },
    actionRowPressed: {
      backgroundColor: palette.pressed,
    },
    actionCopy: {
      flex: 1,
      gap: 4,
    },
    actionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: palette.text,
    },
    actionBody: {
      fontSize: 13,
      lineHeight: 18,
      color: palette.muted,
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
      borderColor: palette.surface,
    },
    trailingValue: {
      fontSize: 13,
      fontWeight: '700',
      color: palette.muted,
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
      backgroundColor: palette.surface,
      padding: 20,
      gap: 10,
      borderWidth: 1,
      borderColor: palette.border,
    },
    modalCardCompact: {
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: palette.text,
    },
    modalBody: {
      fontSize: 14,
      lineHeight: 20,
      color: palette.muted,
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
      backgroundColor: palette.surface,
      padding: 12,
      gap: 10,
    },
    tintOptionActive: {
      backgroundColor: palette.accentSurface,
    },
    tintSwatch: {
      height: 34,
      borderRadius: 10,
    },
    tintOptionLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: palette.text,
    },
  });
}
