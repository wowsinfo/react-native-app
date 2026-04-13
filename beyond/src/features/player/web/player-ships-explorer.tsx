'use client';

import Link from 'next/link';
import {useState} from 'react';
import type {ServerId} from '@/domain/wows/models';
import {getRatingColor, type RatedShip} from '@/domain/wows/rating';
import {buildPlayerShipDetailPath} from '@/features/router/player-routes';
import {formatDecimal, formatNumber, formatPercent} from './player-format';

type ShipWithEncyclopedia = RatedShip & {
  ship: {
    shipId: string;
    name: string;
    nation: string;
    type: string;
    tier: number;
    imageSmall: string | null;
    isPremium: boolean;
    isSpecial: boolean;
  } | null;
};

type PlayerShipsExplorerProps = {
  accountId: string;
  serverId: ServerId;
  ships: ShipWithEncyclopedia[];
};

const sortOptions = [
  {label: 'Last Battle', value: 'lastBattle'},
  {label: 'Battles', value: 'battles'},
  {label: 'Average Damage', value: 'damage'},
  {label: 'Win Rate', value: 'winRate'},
  {label: 'Average Frags', value: 'frags'},
  {label: 'Rating', value: 'rating'},
] as const;

type SortValue = (typeof sortOptions)[number]['value'];

export function PlayerShipsExplorer({
  accountId,
  serverId,
  ships,
}: PlayerShipsExplorerProps) {
  const [sortValue, setSortValue] = useState<SortValue>('lastBattle');

  const sortedShips = [...ships].sort((left, right) => {
    switch (sortValue) {
      case 'battles':
        return (right.pvp?.battles ?? 0) - (left.pvp?.battles ?? 0);
      case 'damage':
        return (right.averageDamage ?? 0) - (left.averageDamage ?? 0);
      case 'winRate':
        return (right.averageWinRate ?? 0) - (left.averageWinRate ?? 0);
      case 'frags':
        return (right.averageFrags ?? 0) - (left.averageFrags ?? 0);
      case 'rating':
        return (right.rating ?? -1) - (left.rating ?? -1);
      case 'lastBattle':
      default:
        return (right.lastBattleAt ?? 0) - (left.lastBattleAt ?? 0);
    }
  });

  return (
    <section className="surface-panel p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="eyebrow">Player Ships</div>
          <h2 className="section-title mt-2">Legacy ship tab, rebuilt for the web.</h2>
        </div>

        <label className="flex flex-col gap-2 text-sm text-muted">
          Sort ships
          <select
            className="field-shell min-w-[220px]"
            onChange={(event) => setSortValue(event.target.value as SortValue)}
            value={sortValue}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sortedShips.map((entry) => (
          <Link
            className="soft-panel overflow-hidden transition hover:-translate-y-0.5"
            href={buildPlayerShipDetailPath(serverId, accountId, entry.shipId)}
            key={entry.shipId}
          >
            <div className="h-2 w-full" style={{backgroundColor: getRatingColor(entry.rating)}} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-ink">{entry.ship?.name ?? entry.shipId}</div>
                  <div className="mt-1 text-sm text-muted">
                    Tier {entry.ship?.tier ?? '?'} {entry.ship?.nation ?? 'Unknown'}{' '}
                    {entry.ship?.type ?? ''}
                  </div>
                </div>
                <div
                  className="rounded-full px-3 py-1 text-sm font-semibold text-white"
                  style={{backgroundColor: getRatingColor(entry.rating)}}
                >
                  {entry.rating ?? 'N/A'}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <ShipDatum label="Battles" value={formatNumber(entry.pvp?.battles ?? 0)} />
                <ShipDatum label="Win Rate" value={formatPercent(entry.averageWinRate)} />
                <ShipDatum label="Average Damage" value={formatNumber(entry.averageDamage)} />
                <ShipDatum label="Average Frags" value={formatDecimal(entry.averageFrags)} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ShipDatum({label, value}: {label: string; value: string}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</div>
      <div className="mt-1 font-semibold text-ink">{value}</div>
    </div>
  );
}

