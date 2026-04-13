import Link from 'next/link';
import {getRatingColor} from '@/domain/wows/rating';
import {getPlayerOverviewSnapshot} from '@/features/player/player-queries';
import {buildPlayerShipDetailPath, buildPlayerShipsPath} from '@/features/router/player-routes';
import {PlayerPageChrome} from './player-page-chrome';
import {calculateAverage, calculateWinRate, formatDecimal, formatNumber, formatPercent} from './player-format';

type PlayerOverviewPageProps = {
  serverId: string;
  accountId: string;
};

export async function PlayerOverviewPage({
  serverId,
  accountId,
}: PlayerOverviewPageProps) {
  const snapshot = await getPlayerOverviewSnapshot({serverId, accountId});
  const pvp = snapshot.header.pvp;
  const battles = pvp?.battles ?? 0;
  const summaryMetrics = [
    {
      label: 'Average Damage',
      value: formatNumber(calculateAverage(pvp?.damageDealt ?? 0, battles)),
    },
    {
      label: 'Average Frags',
      value: formatDecimal(calculateAverage(pvp?.frags ?? 0, battles)),
    },
    {
      label: 'Survival Rate',
      value: formatPercent(calculateWinRate(pvp?.survivedBattles ?? 0, battles)),
    },
    {
      label: 'Planes Destroyed',
      value: formatNumber(pvp?.planesKilled ?? 0),
    },
    {
      label: 'Record Damage',
      value: formatNumber(pvp?.maxDamageDealt ?? 0),
    },
    {
      label: 'Record Frags',
      value: formatNumber(pvp?.maxFragsBattle ?? 0),
    },
  ];

  return (
    <PlayerPageChrome activeTab="overview" header={snapshot.header}>
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_380px]">
        <div className="surface-panel p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="eyebrow">Statistics</div>
              <h2 className="section-title mt-2">Legacy summary, web-first layout.</h2>
            </div>
            <Link
              className="action-chip self-start sm:self-auto"
              href={buildPlayerShipsPath(snapshot.header.serverId, snapshot.header.accountId)}
            >
              Open ship table
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {summaryMetrics.map((metric) => (
              <div className="stat-tile" key={metric.label}>
                <div className="text-xs uppercase tracking-[0.18em] text-muted">
                  {metric.label}
                </div>
                <div className="mt-2 text-2xl font-semibold text-ink">{metric.value}</div>
              </div>
            ))}
          </div>
        </div>

        <aside className="surface-panel p-6 sm:p-8">
          <div className="eyebrow">Top Ships</div>
          <h2 className="section-title mt-2">Best performing hulls.</h2>
          <div className="mt-6 space-y-3">
            {snapshot.topShips.map((entry) => (
              <Link
                className="soft-panel block p-4 transition hover:-translate-y-0.5"
                href={buildPlayerShipDetailPath(
                  snapshot.header.serverId,
                  snapshot.header.accountId,
                  entry.shipId,
                )}
                key={entry.shipId}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-ink">{entry.ship?.name ?? entry.shipId}</div>
                    <div className="mt-1 text-sm text-muted">
                      Tier {entry.ship?.tier ?? '?'} {entry.ship?.type ?? 'Unknown'}
                    </div>
                  </div>
                  <div
                    className="rounded-full px-3 py-1 text-sm font-semibold text-white"
                    style={{backgroundColor: getRatingColor(entry.rating)}}
                  >
                    {entry.rating ?? 'N/A'}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <ShipMetric label="Battles" value={formatNumber(entry.pvp?.battles ?? 0)} />
                  <ShipMetric label="Win Rate" value={formatPercent(entry.averageWinRate)} />
                  <ShipMetric label="Damage" value={formatNumber(entry.averageDamage)} />
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </PlayerPageChrome>
  );
}

function ShipMetric({label, value}: {label: string; value: string}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</div>
      <div className="mt-1 font-semibold text-ink">{value}</div>
    </div>
  );
}

