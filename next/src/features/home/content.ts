export type GameServer = 'ru' | 'eu' | 'na' | 'asia';

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

export const serverOptions: Array<{key: GameServer; label: string}> = [
  {key: 'ru', label: 'Russia'},
  {key: 'eu', label: 'Europe'},
  {key: 'na', label: 'North America'},
  {key: 'asia', label: 'Asia'},
];

export function getHomeSections(server: GameServer): HomeSection[] {
  const domain = serverDomainMap[server];
  const prefix = serverPrefixMap[server];

  return [
    {
      title: 'Encyclopedia',
      items: [
        {title: 'Achievement', routeKey: 'Achievement'},
        {title: 'Warships', routeKey: 'Warship'},
        {title: 'Upgrades', routeKey: 'ConsumableUpgrade'},
        {title: 'Flags / Camouflages', routeKey: 'Consumable'},
        {title: 'Maps', routeKey: 'Map'},
        {title: 'Collections', routeKey: 'Collection'},
      ],
    },
    {
      title: 'Quick Actions',
      items: [
        {title: 'Search', description: 'Player and clan lookup', routeKey: 'Search'},
        {title: 'Settings', description: 'App and API preferences', routeKey: 'Settings'},
        {title: 'Personal Rating', description: 'Read the external rating guide', url: appLinks.personalRating},
      ],
    },
    {
      title: 'Extra',
      items: [
        {
          title: 'RS Beta',
          description: 'Realtime statistics companion for battles',
          routeKey: 'RS',
        },
        {
          title: 'Leave Feedback',
          description: 'Contact the developer directly',
          url: appLinks.developer,
        },
        {
          title: 'Latest Release',
          description: 'Track the current legacy app release',
          url: appLinks.latestRelease,
        },
      ],
    },
    {
      title: 'Official Websites',
      items: [
        {
          title: 'World of Warships',
          url: `https://worldofwarships.${domain}/`,
        },
        {
          title: 'Premium Shop',
          url: `https://${prefix}.wargaming.net/shop/wows/`,
        },
        {
          title: 'Global Wiki',
          url: 'https://wiki.wargaming.net/en/World_of_Warships/',
        },
        {
          title: 'Developer Blog',
          url: 'https://blog.worldofwarships.com/',
        },
      ],
    },
    {
      title: 'Content Creators',
      items: [
        {
          title: 'WoWs Official',
          url: 'https://www.youtube.com/user/worldofwarshipscom',
        },
        {
          title: 'AozoraFubuki',
          url: 'https://www.youtube.com/@SYC-HANQ/videos',
        },
      ],
    },
    {
      title: 'Stats & News',
      items: [
        {
          title: 'WoWS Numbers',
          url: `https://${prefix}.wows-numbers.com/`,
        },
        {
          title: 'GameModels3D',
          url: 'https://gamemodels3d.com/games/worldofwarships/',
        },
      ],
    },
    {
      title: 'Utilities',
      items: [
        {
          title: 'WoWs Fitting Tool',
          url: 'https://wowsft.com/',
        },
      ],
    },
    {
      title: 'In-Game Websites',
      items: [
        {
          title: 'Wargaming Login',
          description: 'Log in before opening armory or warehouse pages',
          url: `https://${prefix}.wargaming.net/id/signin/`,
        },
        {
          title: 'My Bonus',
          url: `https://worldofwarships.${domain}/userbonus/`,
        },
        {
          title: 'In-Game News',
          url: `https://worldofwarships.${domain}/news_ingame/`,
        },
        {
          title: 'My Armory',
          url: `https://armory.worldofwarships.${domain}/`,
        },
        {
          title: 'My Clan',
          url: `https://clans.worldofwarships.${domain}/clans/gateway/wows/profile/`,
        },
        {
          title: 'My Warehouse',
          url: `https://warehouse.worldofwarships.${domain}/`,
        },
        {
          title: 'My Logbook',
          url: `https://logbook.worldofwarships.${domain}/`,
        },
      ],
    },
  ];
}

export function getStoreUrl() {
  return appLinks.googlePlay;
}

export function isLinkItem(
  item: LinkItem | RouteItem,
): item is LinkItem {
  return 'url' in item;
}
