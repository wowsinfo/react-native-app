import type {
  WowsPlayerShipRecord,
  WowsShipExpectedRecord,
} from './player-records';

export type RatedShip = WowsPlayerShipRecord & {
  rating: number | null;
  actionPoints: number;
  averageDamage: number | null;
  averageWinRate: number | null;
  averageFrags: number | null;
  expected: WowsShipExpectedRecord | null;
};

export type RatingSummary = {
  overallRating: number | null;
  ships: RatedShip[];
};

export function buildRatingSummary(
  ships: WowsPlayerShipRecord[],
  expectedByShipId: Record<string, WowsShipExpectedRecord>,
): RatingSummary {
  let actualDamage = 0;
  let actualWins = 0;
  let actualFrags = 0;
  let expectedDamage = 0;
  let expectedWins = 0;
  let expectedFrags = 0;

  const ratedShips = ships.map<RatedShip>((ship) => {
    const battles = ship.pvp?.battles ?? 0;
    const expected = expectedByShipId[ship.shipId] ?? null;

    if (!ship.pvp || battles === 0 || !expected) {
      return {
        ...ship,
        rating: null,
        actionPoints: 0,
        averageDamage: null,
        averageWinRate: null,
        averageFrags: null,
        expected,
      };
    }

    const averageDamage = ship.pvp.damageDealt / battles;
    const averageWinRate = (ship.pvp.wins / battles) * 100;
    const averageFrags = ship.pvp.frags / battles;
    const rating = calculatePersonalRating(
      averageDamage,
      expected.averageDamageDealt,
      averageWinRate,
      expected.winRate,
      averageFrags,
      expected.averageFrags,
    );

    actualDamage += averageDamage;
    actualWins += averageWinRate;
    actualFrags += averageFrags;
    expectedDamage += expected.averageDamageDealt;
    expectedWins += expected.winRate;
    expectedFrags += expected.averageFrags;

    return {
      ...ship,
      rating,
      actionPoints: getActionPoints(rating, battles),
      averageDamage: averageDamage,
      averageWinRate: averageWinRate,
      averageFrags: averageFrags,
      expected,
    };
  });

  const overallRating =
    expectedDamage > 0 && expectedWins > 0 && expectedFrags > 0
      ? calculatePersonalRating(
          actualDamage,
          expectedDamage,
          actualWins,
          expectedWins,
          actualFrags,
          expectedFrags,
        )
      : null;

  return {
    overallRating,
    ships: ratedShips,
  };
}

export function getRatingColor(rating: number | null): string {
  if (rating == null) {
    return 'var(--rating-unknown)';
  }

  if (rating < 750) {
    return 'var(--rating-bad)';
  }
  if (rating < 1100) {
    return 'var(--rating-below-average)';
  }
  if (rating < 1350) {
    return 'var(--rating-average)';
  }
  if (rating < 1550) {
    return 'var(--rating-good)';
  }
  if (rating < 1750) {
    return 'var(--rating-very-good)';
  }
  if (rating < 2100) {
    return 'var(--rating-great)';
  }
  if (rating < 2450) {
    return 'var(--rating-unicum)';
  }

  return 'var(--rating-super-unicum)';
}

function calculatePersonalRating(
  actualDamage: number,
  expectedDamage: number,
  actualWins: number,
  expectedWins: number,
  actualFrags: number,
  expectedFrags: number,
): number {
  const ratioDamage = actualDamage / expectedDamage;
  const ratioWins = actualWins / expectedWins;
  const ratioFrags = actualFrags / expectedFrags;

  const normalizedDamage = Math.max(0, (ratioDamage - 0.4) / 0.6);
  const normalizedFrags = Math.max(0, (ratioFrags - 0.1) / 0.9);
  const normalizedWins = Math.max(0, (ratioWins - 0.7) / 0.3);

  return Math.min(Math.round(700 * normalizedDamage + 300 * normalizedFrags + 150 * normalizedWins), 9999);
}

function getActionPoints(rating: number, battles: number): number {
  if (battles <= 0) {
    return 0;
  }

  return Math.round(Math.log10(Math.max(10, battles)) * rating);
}
