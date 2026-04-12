import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, type ReactNode } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  apiLanguageOptions,
  settingsLinks,
  tintOptions,
  type ChoiceOption,
} from '@/features/settings/content';
import { useAppStateManager } from '@/features/app-state/app-state-manager';
import {
  useAppPreferences,
  type AppLanguagePreference,
  type ThemeMode,
} from '@/features/preferences/preferences-manager';
import { createStackScreenOptions } from '@/features/preferences/theme';
import { getServerOptions } from '@/features/home/content';
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
  const {
    gameServer,
    setGameServer,
    apiLanguage,
    setApiLanguage,
    swapButtons,
    setSwapButtons,
  } = useAppStateManager();
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
  const gameServerOptions = getServerOptions(t);
  const [showTintPicker, setShowTintPicker] = useState(false);

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
    <SafeAreaView className="flex-1 bg-app" edges={['bottom']}>
      <Stack.Screen
        options={createStackScreenOptions(palette, {
          title: t('settings_title'),
        })}
      />
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView>
        <View className="gap-5 p-6">
          <View
            className="gap-2 rounded-[18px] border bg-surface p-5"
            style={{ borderColor: tintColor }}
          >
            <Text
              className="text-[12px] font-extrabold uppercase"
              style={{ color: tintColor, letterSpacing: 1.4 }}
            >
              {t('settings_title')}
            </Text>
            <Text className="text-[28px] font-extrabold text-foreground">
              {t('settings_subtitle')}
            </Text>
            <Text className="text-[15px] leading-[22px] text-muted">
              {t('settings_body')}
            </Text>
          </View>

          <SettingsSection
            title={t('settings_api_title')}
            subtitle={t('settings_api_subtitle')}
          >
            <ChoiceGroup
              label={t('settings_game_server')}
              value={gameServer}
              options={gameServerOptions}
              accentColor={tintColor}
              onChange={setGameServer}
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
              className="mx-[18px] mt-0.5 items-center rounded-[14px] bg-accent py-[14px]"
              style={{ backgroundColor: tintColor }}
              onPress={() =>
                showPendingMessage(t('settings_update_data'), t('settings_update_data_unavailable'))
              }
            >
              <Text className="text-[15px] font-extrabold text-inverse">
                {t('settings_update_data')}
              </Text>
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
              trailing={
                <View
                  className="size-[30px] rounded-full border-2 border-surface"
                  style={{ backgroundColor: tintColor }}
                />
              }
            />
            <SettingsActionRow
              title={t('settings_swap_buttons')}
              description={t('settings_swap_buttons_description')}
              accentColor={tintColor}
              onPress={() => setSwapButtons(!swapButtons)}
              trailing={
                <Text className="text-[13px] font-bold text-muted">
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
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={showTintPicker}
        onRequestClose={() => setShowTintPicker(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/45 p-6"
          onPress={() => setShowTintPicker(false)}
        >
          <Pressable
            className="w-full max-w-[620px] gap-[10px] rounded-[20px] border border-line bg-surface p-5"
            style={{
              maxHeight: compact ? '80%' : undefined,
            }}
            onPress={() => null}
          >
            <Text className="text-[20px] font-extrabold text-foreground">
              {t('settings_tint_picker_title')}
            </Text>
            <Text className="text-[14px] leading-5 text-muted">
              {t('settings_tint_picker_body')}
            </Text>
            <View className="flex-row flex-wrap gap-[10px] pt-2">
              {tintOptions.map(option => {
                const active = option.key === tintKey;

                return (
                  <Pressable
                    key={option.key}
                    className={active ? 'min-w-[130px] gap-[10px] rounded-[14px] border bg-accent-surface p-3' : 'min-w-[130px] gap-[10px] rounded-[14px] border border-line bg-surface p-3'}
                    style={{
                      width: '31%',
                      borderColor: active ? option.value : undefined,
                    }}
                    onPress={() => {
                      setTintKey(option.key);
                      setShowTintPicker(false);
                    }}
                  >
                    <View
                      className="h-[34px] rounded-[10px]"
                      style={{ backgroundColor: option.value }}
                    />
                    <Text className="text-[13px] font-bold text-foreground">
                      {option.name}
                    </Text>
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
    <View className="gap-[10px]">
      <View className="items-center gap-1">
        <Text className="text-center text-[20px] font-extrabold text-foreground">
          {title}
        </Text>
        {subtitle ? (
          <Text className="max-w-[620px] text-center text-[13px] leading-[19px] text-muted">
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
  const currentLabel = options.find(option => option.value === value)?.label ?? value;

  return (
    <View className="gap-3 border-x border-b border-line-soft bg-surface px-[18px] py-4">
      <Text className="text-[15px] font-bold text-foreground">
        {label}{' '}
        <Text className="font-extrabold" style={{ color: accentColor }}>
          - {currentLabel}
        </Text>
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map(option => {
          const active = option.value === value;

          return (
            <Pressable
              key={option.value}
              className={`rounded-full border px-3 py-2 ${active ? 'bg-accent' : 'border-line bg-surface-alt'}`}
              style={{
                borderColor: active ? accentColor : undefined,
              }}
              onPress={() => onChange(option.value)}
            >
              <Text className={`text-[13px] font-bold ${active ? 'text-inverse' : 'text-foreground'}`}>
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

  return (
    <Pressable
      className="min-h-[72px] flex-row items-center gap-3 border-x border-b border-line-soft bg-surface px-[18px] py-4"
      style={({ pressed }) => [
        {
          backgroundColor: pressed && onPress ? palette.pressed : undefined,
        },
      ]}
      onPress={onPress}
    >
      <View className="flex-1 gap-1">
        <Text className="text-[16px] font-bold text-foreground">
          {title}
        </Text>
        {description ? (
          <Text className="text-[13px] leading-[18px] text-muted">
            {description}
          </Text>
        ) : null}
      </View>
      <View className="min-w-[44px] items-end justify-center">
        {trailing ?? (
          <Text
            className="text-[28px]"
            style={{
              color: accentColor,
              lineHeight: 28,
              fontWeight: Platform.OS === 'web' ? '700' : '400',
            }}
          >
            {'>'}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
