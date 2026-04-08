import type {
  PlayerPvpStats,
  WeaponStats,
} from '@/features/player/api';
import type { MessageKey } from '@/features/preferences/messages';
import {
  calculateAverageDamage,
  formatDecimal,
  formatNumber,
  formatPercent,
} from '@/features/player/format';
import type { LegacyIconName as SummaryLegacyIconName } from '@/features/player/legacy-icons';

type Localizer = (key: MessageKey) => string;

export type OverviewMetric = {
  label: string;
  value: string;
};

export type OverviewListItem = {
  title: string;
  description: string;
  trailing?: string;
};

export type OverviewSection = {
  title: string;
  metrics: OverviewMetric[];
};

export type IconSummaryItem = {
  icon: SummaryLegacyIconName;
  label: string;
  value: string;
};

function ratio(numerator: number, denominator: number) {
  if (denominator <= 0) {
    return 0;
  }

  return numerator / denominator;
}

function safePercent(numerator: number, denominator: number, digits = 1) {
  return formatPercent(ratio(numerator, denominator) * 100, digits);
}

function createMetric(t: Localizer, key: MessageKey, value: string): OverviewMetric {
  return {
    label: t(key),
    value,
  };
}

function createShipLabel(shipId: number | undefined, t: Localizer) {
  if (!shipId) {
    return t('common_unknown');
  }

  return `Ship ${shipId}`;
}

export function getDetailedSections(
  stats: PlayerPvpStats | null | undefined,
  t: Localizer,
): OverviewSection[] {
  if (!stats) {
    return [];
  }

  const battles = stats.battles ?? 0;
  const survivedBattles = stats.survived_battles ?? 0;
  const shipsSpotted = stats.ships_spotted ?? 0;
  const artAgro = stats.art_agro ?? 0;
  const torpedoAgro = stats.torpedo_agro ?? 0;
  const scoutingDamage = stats.damage_scouting ?? 0;
  const planeKills = stats.planes_killed ?? 0;

  const sections: OverviewSection[] = [
    {
      title: t('player_detailed_title'),
      metrics: [
        createMetric(t, 'player_wins', formatNumber(stats.wins)),
        createMetric(t, 'player_draws', formatNumber(stats.draws)),
        createMetric(t, 'player_losses', formatNumber(stats.losses)),
        createMetric(t, 'player_survived', formatNumber(stats.survived_battles)),
        createMetric(t, 'player_survived_wins', formatNumber(stats.survived_wins)),
        createMetric(t, 'player_total_xp', formatNumber(stats.xp)),
        createMetric(t, 'player_avg_xp', formatNumber(ratio(stats.xp ?? 0, battles))),
        createMetric(t, 'player_survival_rate', safePercent(survivedBattles, battles)),
        createMetric(
          t,
          'player_survived_win_rate',
          safePercent(stats.survived_wins ?? 0, survivedBattles),
        ),
      ],
    },
  ];

  if (artAgro > 0 || torpedoAgro > 0 || scoutingDamage > 0) {
    sections.push({
      title: t('player_detailed_subtitle'),
      metrics: [
        createMetric(t, 'player_total_potential_damage', formatNumber(artAgro)),
        createMetric(
          t,
          'player_avg_potential_damage',
          formatNumber(ratio(artAgro, battles)),
        ),
        createMetric(
          t,
          'player_total_torpedo_potential_damage',
          formatNumber(torpedoAgro),
        ),
        createMetric(
          t,
          'player_avg_torpedo_potential_damage',
          formatNumber(ratio(torpedoAgro, battles)),
        ),
        createMetric(t, 'player_total_scouting_damage', formatNumber(scoutingDamage)),
        createMetric(
          t,
          'player_avg_scouting_damage',
          formatNumber(ratio(scoutingDamage, battles)),
        ),
        createMetric(t, 'player_total_damage', formatNumber(stats.damage_dealt)),
        createMetric(
          t,
          'player_damage_potential_ratio',
          safePercent(stats.damage_dealt ?? 0, artAgro, 2),
        ),
      ],
    });
  }

  sections.push({
    title: t('player_records_subtitle'),
    metrics: [
      createMetric(t, 'player_total_spotted', formatNumber(shipsSpotted)),
      createMetric(t, 'player_avg_spotted', formatDecimal(ratio(shipsSpotted, battles), 2)),
      createMetric(t, 'player_total_frags', formatNumber(stats.frags)),
      createMetric(
        t,
        'player_frag_spot_ratio',
        safePercent(stats.frags ?? 0, shipsSpotted, 2),
      ),
      createMetric(t, 'player_total_planes_killed', formatNumber(planeKills)),
      createMetric(
        t,
        'player_avg_planes_killed',
        formatDecimal(ratio(planeKills, battles), 2),
      ),
      createMetric(t, 'player_avg_damage', formatNumber(calculateAverageDamage(stats))),
    ],
  });

  return sections;
}

export function getShipRecordSections(
  stats: PlayerPvpStats | null | undefined,
  t: Localizer,
): OverviewSection[] {
  if (!stats) {
    return [];
  }

  return [
    {
      title: t('player_ship_detail_records_title'),
      metrics: [
        createMetric(t, 'player_max_damage', formatNumber(stats.max_damage_dealt)),
        createMetric(t, 'player_total_scouting_damage', formatNumber(stats.max_damage_scouting)),
        createMetric(t, 'player_max_xp', formatNumber(stats.max_xp)),
        createMetric(t, 'player_max_frags', formatNumber(stats.max_frags_battle)),
        createMetric(t, 'player_total_spotted', formatNumber(stats.max_ships_spotted)),
        createMetric(t, 'player_total_planes_killed', formatNumber(stats.max_planes_killed)),
      ],
    },
  ].filter(section => section.metrics.some(metric => metric.value !== '0'));
}

export function getClassicSummaryItems(
  stats: PlayerPvpStats | null | undefined,
  t: Localizer,
  options?: { topOnly?: boolean },
): IconSummaryItem[] {
  if (!stats) {
    return [];
  }

  const battles = stats.battles ?? 0;
  const survivedBattles = stats.survived_battles ?? 0;
  const deaths = Math.max(battles - survivedBattles, 0);
  const mainBatteryHits = stats.main_battery?.hits ?? 0;
  const mainBatteryShots = stats.main_battery?.shots ?? 0;

  const items: IconSummaryItem[] = [
    { icon: 'Battle', label: t('player_battles'), value: formatNumber(stats.battles) },
    { icon: 'WinRate', label: t('player_win_rate'), value: safePercent(stats.wins ?? 0, battles, 2) },
    { icon: 'Damage', label: t('player_avg_damage'), value: formatNumber(calculateAverageDamage(stats)) },
  ];

  if (options?.topOnly) {
    return items;
  }

  items.push(
    { icon: 'EXP', label: t('player_avg_xp'), value: formatNumber(ratio(stats.xp ?? 0, battles)) },
    {
      icon: 'KillDeathRatio',
      label: t('player_kill_death_ratio'),
      value: formatDecimal(ratio(stats.frags ?? 0, deaths), 2),
    },
    {
      icon: 'HitRatio',
      label: t('player_hit_ratio'),
      value: safePercent(mainBatteryHits, mainBatteryShots, 2),
    },
  );

  return items;
}

export function getRecordItems(
  stats: PlayerPvpStats | null | undefined,
  t: Localizer,
): OverviewListItem[] {
  if (!stats) {
    return [];
  }

  return [
    {
      title: t('player_max_damage'),
      description: createShipLabel(stats.max_damage_dealt_ship_id, t),
      trailing: formatNumber(stats.max_damage_dealt),
    },
    {
      title: t('player_max_xp'),
      description: createShipLabel(stats.max_xp_ship_id, t),
      trailing: formatNumber(stats.max_xp),
    },
    {
      title: t('player_max_frags'),
      description: createShipLabel(stats.max_frags_ship_id, t),
      trailing: formatNumber(stats.max_frags_battle),
    },
    {
      title: t('player_total_scouting_damage'),
      description: createShipLabel(stats.max_scouting_damage_ship_id, t),
      trailing: formatNumber(stats.max_damage_scouting),
    },
    {
      title: t('player_total_planes_killed'),
      description: createShipLabel(stats.max_planes_killed_ship_id, t),
      trailing: formatNumber(stats.max_planes_killed),
    },
    {
      title: t('player_total_spotted'),
      description: createShipLabel(stats.max_ships_spotted_ship_id, t),
      trailing: formatNumber(stats.max_ships_spotted),
    },
    {
      title: t('player_total_potential_damage'),
      description: createShipLabel(stats.max_total_agro_ship_id, t),
      trailing: formatNumber(stats.max_total_agro),
    },
  ].filter(item => item.trailing !== '0');
}

function createWeaponRecord(
  title: string,
  stats: WeaponStats | undefined,
  t: Localizer,
): OverviewListItem | null {
  if (!stats || !stats.max_frags_ship_id) {
    return null;
  }

  const fragments: string[] = [
    `${t('player_record_total_frags')} ${formatNumber(stats.frags)}`,
    `${t('player_record_max_frags')} ${formatNumber(stats.max_frags_battle)}`,
  ];

  if ((stats.hits ?? 0) > 0 && (stats.shots ?? 0) > 0) {
    fragments.push(
      `${t('player_record_hit_ratio')} ${safePercent(stats.hits ?? 0, stats.shots ?? 0, 2)}`,
    );
  }

  return {
    title,
    description: `${t('player_record_best_ship')} ${createShipLabel(stats.max_frags_ship_id, t)}`,
    trailing: fragments.join(' | '),
  };
}

export function getWeaponRecordItems(
  stats: PlayerPvpStats | null | undefined,
  t: Localizer,
): OverviewListItem[] {
  if (!stats) {
    return [];
  }

  return [
    createWeaponRecord(t('player_weapon_main_battery'), stats.main_battery, t),
    createWeaponRecord(t('player_weapon_second_battery'), stats.second_battery, t),
    createWeaponRecord(t('player_weapon_torpedoes'), stats.torpedoes, t),
    createWeaponRecord(t('player_weapon_aircraft'), stats.aircraft, t),
    createWeaponRecord(t('player_weapon_ramming'), stats.ramming, t),
  ].filter((item): item is OverviewListItem => item != null);
}
