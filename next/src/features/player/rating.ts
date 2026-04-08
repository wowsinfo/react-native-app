import type { ShipStats } from '@/features/player/api';

type PersonalRatingReference = {
  average_damage_dealt: number;
  average_frags: number;
  win_rate: number;
};

type PersonalRatingFile = {
  data: Record<string, PersonalRatingReference | []>;
};

const personalRatingData = require('../../data/personal_rating.json') as PersonalRatingFile;

const ratingColors = [
  '#607D8B',
  '#D32F2F',
  '#FF9800',
  '#FFB300',
  '#7CB342',
  '#388E3C',
  '#03A9F4',
  '#9C27B0',
  '#673AB7',
] as const;

const ratingLabels = [
  'player_rating_unknown',
  'player_rating_bad',
  'player_rating_below_average',
  'player_rating_average',
  'player_rating_good',
  'player_rating_very_good',
  'player_rating_great',
  'player_rating_unicum',
  'player_rating_super_unicum',
] as const;

const ratingRanges = [0, 750, 1100, 1350, 1550, 1750, 2100, 2450, 9999] as const;

function roundTo(value: number, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function calculatePersonalRatingValue(
  actualDamage: number,
  expectedDamage: number,
  actualWins: number,
  expectedWins: number,
  actualFrags: number,
  expectedFrags: number,
) {
  if (
    expectedDamage <= 0 ||
    expectedWins <= 0 ||
    expectedFrags <= 0
  ) {
    return null;
  }

  const damageRatio = actualDamage / expectedDamage;
  const winsRatio = actualWins / expectedWins;
  const fragsRatio = actualFrags / expectedFrags;

  const normalizedDamage = Math.max(0, (damageRatio - 0.4) / 0.6);
  const normalizedFrags = Math.max(0, (fragsRatio - 0.1) / 0.9);
  const normalizedWins = Math.max(0, (winsRatio - 0.7) / 0.3);

  return Math.min(
    roundTo(700 * normalizedDamage + 300 * normalizedFrags + 150 * normalizedWins),
    9999,
  );
}

function getReference(shipId: number) {
  const value = personalRatingData.data[String(shipId)];

  if (!value || Array.isArray(value)) {
    return null;
  }

  return value;
}

export function calculateOverallRating(ships: ShipStats[]) {
  let actualDamage = 0;
  let expectedDamage = 0;
  let actualWins = 0;
  let expectedWins = 0;
  let actualFrags = 0;
  let expectedFrags = 0;
  let ratedShipCount = 0;

  for (const ship of ships) {
    const stats = ship.pvp;
    const reference = getReference(ship.ship_id);
    const battles = stats?.battles ?? 0;

    if (!reference || battles <= 0) {
      continue;
    }

    actualDamage += (stats?.damage_dealt ?? 0) / battles;
    actualWins += ((stats?.wins ?? 0) / battles) * 100;
    actualFrags += (stats?.frags ?? 0) / battles;
    expectedDamage += reference.average_damage_dealt;
    expectedWins += reference.win_rate;
    expectedFrags += reference.average_frags;
    ratedShipCount += 1;
  }

  const rating = calculatePersonalRatingValue(
    actualDamage,
    expectedDamage,
    actualWins,
    expectedWins,
    actualFrags,
    expectedFrags,
  );

  return {
    rating,
    ratedShipCount,
  };
}

export function getRatingIndex(rating?: number | null) {
  if (rating == null || rating <= 0) {
    return 0;
  }

  const index = ratingRanges.findIndex(range => rating < range);
  return index === -1 ? 0 : index;
}

export function getRatingColor(rating?: number | null) {
  return ratingColors[getRatingIndex(rating)] ?? ratingColors[0];
}

export function getRatingLabelKey(rating?: number | null) {
  return ratingLabels[getRatingIndex(rating)] ?? ratingLabels[0];
}
