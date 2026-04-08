import type {
  PlayerPvpStats,
  RankSeasonInfo,
  RankShipStats,
  ShipStats,
} from '@/features/player/api';

export function formatNumber(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) {
    return '0';
  }

  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

export function formatDecimal(value: number | null | undefined, digits = 1) {
  if (value == null || Number.isNaN(value)) {
    return '0';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number | null | undefined, digits = 1) {
  return `${formatDecimal(value, digits)}%`;
}

export function formatDateTime(timestamp: number | null | undefined) {
  if (!timestamp) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp * 1000));
}

export function calculateWinRate(stats: PlayerPvpStats | null | undefined) {
  const battles = stats?.battles ?? 0;
  const wins = stats?.wins ?? 0;

  if (battles === 0) {
    return 0;
  }

  return (wins / battles) * 100;
}

export function calculateAverageDamage(stats: PlayerPvpStats | null | undefined) {
  const battles = stats?.battles ?? 0;
  const damage = stats?.damage_dealt ?? 0;

  if (battles === 0) {
    return 0;
  }

  return damage / battles;
}

export function calculateAverageFrags(stats: PlayerPvpStats | null | undefined) {
  const battles = stats?.battles ?? 0;
  const frags = stats?.frags ?? 0;

  if (battles === 0) {
    return 0;
  }

  return frags / battles;
}

export function sortShips(
  ships: ShipStats[],
  mode: 'lastBattle' | 'battles' | 'damage' | 'winRate',
) {
  const list = [...ships];

  list.sort((left, right) => {
    if (mode === 'lastBattle') {
      return (right.last_battle_time ?? 0) - (left.last_battle_time ?? 0);
    }

    if (mode === 'battles') {
      return (right.pvp?.battles ?? 0) - (left.pvp?.battles ?? 0);
    }

    if (mode === 'damage') {
      return (
        calculateAverageDamage(right.pvp) - calculateAverageDamage(left.pvp)
      );
    }

    return calculateWinRate(right.pvp) - calculateWinRate(left.pvp);
  });

  return list;
}

export function getLatestRank(seasons: Record<string, RankSeasonInfo>) {
  const keys = Object.keys(seasons).sort((left, right) => Number(right) - Number(left));

  for (const key of keys) {
    const rank = seasons[key]?.rank_info?.rank;

    if (rank && rank > 0) {
      return {
        season: key,
        rank,
      };
    }
  }

  return null;
}

export function normalizeRankShips(rankShips: RankShipStats[]) {
  const grouped: Record<string, Array<{shipId: number; stats: PlayerPvpStats}>> = {};

  for (const ship of rankShips) {
    const seasons = ship.seasons ?? {};

    for (const [season, entries] of Object.entries(seasons)) {
      const stats =
        entries.rank_solo ?? entries.rank_div2 ?? entries.rank_div3 ?? null;

      if (!stats) {
        continue;
      }

      if (!grouped[season]) {
        grouped[season] = [];
      }

      grouped[season].push({
        shipId: ship.ship_id,
        stats,
      });
    }
  }

  return grouped;
}

export function getTopShipLists(ships: ShipStats[]) {
  const byBattles = sortShips(ships, 'battles').slice(0, 8);
  const byDamage = sortShips(
    ships.filter(ship => (ship.pvp?.battles ?? 0) >= 5),
    'damage',
  ).slice(0, 8);
  const byWinRate = sortShips(
    ships.filter(ship => (ship.pvp?.battles ?? 0) >= 20),
    'winRate',
  ).slice(0, 8);

  return {
    byBattles,
    byDamage,
    byWinRate,
  };
}
