import { type MessageKey } from '@/features/preferences/messages';

export type GameServer = 'ru' | 'eu' | 'na' | 'asia';

type Translator = (key: MessageKey) => string;

type LinkDefinition = {
  titleKey: MessageKey;
  descriptionKey?: MessageKey;
  url: (server: GameServer) => string;
};

type RouteDefinition = {
  titleKey: MessageKey;
  descriptionKey?: MessageKey;
  routeKey: string;
};

type HomeSectionDefinition = {
  titleKey: MessageKey;
  items: Array<LinkDefinition | RouteDefinition>;
};

type ServerOptionDefinition = {
  key: GameServer;
  labelKey: MessageKey;
};

type LinkItem = {
  title: string;
  description?: string;
  url: string;
};

type RouteItem = {
  title: string;
  description?: string;
  routeKey: string;
};

export type HomeSection = {
  title: string;
  items: Array<LinkItem | RouteItem>;
};

export const appLinks = {
  github: 'https://github.com/wowsinfo/react-native-app',
  appStore: 'https://itunes.apple.com/app/id1202750166',
  googlePlay:
    'https://play.google.com/store/apps/details?id=com.yihengquan.wowsinfo',
  developer:
    'mailto:development.henryquan@gmail.com?subject=[WoWs Info Next] ',
  personalRating: 'https://wows-numbers.com/personal/rating',
  latestRelease: 'https://github.com/wowsinfo/react-native-app/releases/latest',
} as const;

const serverDomainMap: Record<GameServer, string> = {
  ru: 'ru',
  eu: 'eu',
  na: 'com',
  asia: 'asia',
};

const serverPrefixMap: Record<GameServer, string> = {
  ru: 'ru',
  eu: 'eu',
  na: 'na',
  asia: 'asia',
};

const serverOptionDefinitions: ServerOptionDefinition[] = [
  { key: 'ru', labelKey: 'server_russia' },
  { key: 'eu', labelKey: 'server_europe' },
  { key: 'na', labelKey: 'server_north_america' },
  { key: 'asia', labelKey: 'server_asia' },
];

const homeSectionDefinitions: HomeSectionDefinition[] = [
  {
    titleKey: 'home_section_encyclopedia',
    items: [
      { titleKey: 'home_item_achievement', routeKey: 'Achievement' },
      { titleKey: 'home_item_warships', routeKey: 'Warship' },
      { titleKey: 'home_item_upgrades', routeKey: 'ConsumableUpgrade' },
      { titleKey: 'home_item_flags', routeKey: 'Consumable' },
      { titleKey: 'home_item_maps', routeKey: 'Map' },
      { titleKey: 'home_item_collections', routeKey: 'Collection' },
    ],
  },
  {
    titleKey: 'home_section_quick_actions',
    items: [
      {
        titleKey: 'common_search',
        descriptionKey: 'home_search_hint',
        routeKey: 'Search',
      },
      {
        titleKey: 'common_settings',
        descriptionKey: 'home_item_settings_desc',
        routeKey: 'Settings',
      },
      {
        titleKey: 'home_item_personal_rating',
        descriptionKey: 'home_item_personal_rating_desc',
        url: () => appLinks.personalRating,
      },
    ],
  },
  {
    titleKey: 'home_section_extra',
    items: [
      {
        titleKey: 'home_item_rs_beta',
        descriptionKey: 'home_item_rs_beta_desc',
        routeKey: 'RS',
      },
      {
        titleKey: 'home_item_feedback',
        descriptionKey: 'home_item_feedback_desc',
        url: () => appLinks.developer,
      },
      {
        titleKey: 'home_item_latest_release',
        descriptionKey: 'home_item_latest_release_desc',
        url: () => appLinks.latestRelease,
      },
    ],
  },
  {
    titleKey: 'home_section_official_sites',
    items: [
      {
        titleKey: 'home_item_world_of_warships',
        url: server => `https://worldofwarships.${getServerDomain(server)}/`,
      },
      {
        titleKey: 'home_item_premium_shop',
        url: server => `https://${getServerPrefix(server)}.wargaming.net/shop/wows/`,
      },
      {
        titleKey: 'home_item_global_wiki',
        url: () => 'https://wiki.wargaming.net/en/World_of_Warships/',
      },
      {
        titleKey: 'home_item_dev_blog',
        url: () => 'https://blog.worldofwarships.com/',
      },
    ],
  },
  {
    titleKey: 'home_section_creators',
    items: [
      {
        titleKey: 'home_item_wows_official',
        url: () => 'https://www.youtube.com/user/worldofwarshipscom',
      },
      {
        titleKey: 'home_item_aozora',
        url: () => 'https://www.youtube.com/@SYC-HANQ/videos',
      },
    ],
  },
  {
    titleKey: 'home_section_stats_news',
    items: [
      {
        titleKey: 'home_item_wows_numbers',
        url: server => `https://${getServerPrefix(server)}.wows-numbers.com/`,
      },
      {
        titleKey: 'home_item_gamemodels',
        url: () => 'https://gamemodels3d.com/games/worldofwarships/',
      },
    ],
  },
  {
    titleKey: 'home_section_utilities',
    items: [
      {
        titleKey: 'home_item_fitting_tool',
        url: () => 'https://wowsft.com/',
      },
    ],
  },
  {
    titleKey: 'home_section_ingame_sites',
    items: [
      {
        titleKey: 'home_item_wargaming_login',
        descriptionKey: 'home_item_wargaming_login_desc',
        url: server => `https://${getServerPrefix(server)}.wargaming.net/id/signin/`,
      },
      {
        titleKey: 'home_item_my_bonus',
        url: server => `https://worldofwarships.${getServerDomain(server)}/userbonus/`,
      },
      {
        titleKey: 'home_item_ingame_news',
        url: server => `https://worldofwarships.${getServerDomain(server)}/news_ingame/`,
      },
      {
        titleKey: 'home_item_my_armory',
        url: server => `https://armory.worldofwarships.${getServerDomain(server)}/`,
      },
      {
        titleKey: 'home_item_my_clan',
        url: server =>
          `https://clans.worldofwarships.${getServerDomain(server)}/clans/gateway/wows/profile/`,
      },
      {
        titleKey: 'home_item_my_warehouse',
        url: server => `https://warehouse.worldofwarships.${getServerDomain(server)}/`,
      },
      {
        titleKey: 'home_item_my_logbook',
        url: server => `https://logbook.worldofwarships.${getServerDomain(server)}/`,
      },
    ],
  },
];

export const serverOptions = serverOptionDefinitions.map(option => ({
  key: option.key,
  label: option.key,
}));

export function isGameServer(value: string): value is GameServer {
  return serverOptionDefinitions.some(option => option.key === value);
}

export function getServerDomain(server: GameServer) {
  return serverDomainMap[server];
}

export function getServerPrefix(server: GameServer) {
  return serverPrefixMap[server];
}

export function getServerOptions(t: Translator) {
  return serverOptionDefinitions.map(option => ({
    value: option.key,
    label: t(option.labelKey),
  }));
}

export function getServerLabel(server: GameServer, t: Translator) {
  return getServerOptions(t).find(option => option.value === server)?.label ?? server;
}

export function getHomeSections(server: GameServer, t: Translator): HomeSection[] {
  return homeSectionDefinitions.map(section => ({
    title: t(section.titleKey),
    items: section.items.map(item => ({
      title: t(item.titleKey),
      description: item.descriptionKey ? t(item.descriptionKey) : undefined,
      ...('url' in item
        ? { url: item.url(server) }
        : { routeKey: item.routeKey }),
    })),
  }));
}

export function getStoreUrl() {
  return appLinks.googlePlay;
}

export function isLinkItem(
  item: LinkItem | RouteItem,
): item is LinkItem {
  return 'url' in item;
}
