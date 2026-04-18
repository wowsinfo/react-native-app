import Link from 'next/link';
import {getRatingColor} from '@/domain/wows/rating';
import {getPlayerShipDetailSnapshot} from '@/features/player/player-queries';
import {buildPlayerShipsPath} from '@/features/router/player-routes';
import {PlayerPageChrome} from './player-page-chrome';
import {formatDecimal, formatNumber, formatPercent} from './player-format';

type PlayerShipDetailPageProps = {
  serverId: string;
  accountId: string;
  shipId: string;
};

export async function PlayerShipDetailPage({
  serverId,
  accountId,
  shipId,
}: PlayerShipDetailPageProps) {
  const snapshot = await getPlayerShipDetailSnapshot({serverId, accountId, shipId});
  const entry = snapshot.ship;

  const differenceMetrics = [
    {
      label: 'Damage vs Expected',
      value:
        entry.averageDamage != null && entry.expected
          ? signedNumber(entry.averageDamage - entry.expected.averageDamageDealt)
          : 'N/A',
    },
    {
      label: 'Win Rate vs Expected',
      value:
        entry.averageWinRate != null && entry.expected
          ? signedPercent(entry.averageWinRate - entry.expected.winRate)
          : 'N/A',
    },
    {
      label: 'Frags vs Expected',
      value:
        entry.averageFrags != null && entry.expected
          ? signedDecimal(entry.averageFrags - entry.expected.averageFrags)
          : 'N/A',
    },
  ];

  const detailMetrics = [
    {label: 'Battles', value: formatNumber(entry.pvp?.battles ?? 0)},
    {label: 'Win Rate', value: formatPercent(entry.averageWinRate)},
    {label: 'Average Damage', value: formatNumber(entry.averageDamage)},
    {label: 'Average Frags', value: formatDecimal(entry.averageFrags)},
    {label: 'Action Points', value: formatNumber(entry.actionPoints)},
    {label: 'Record Damage', value: formatNumber(entry.pvp?.maxDamageDealt ?? 0)},
  ];

  return (
    <PlayerPageChrome activeTab="ships" header={snapshot.header}>
      <section className="surface-panel p-6 sm:p-8">
        <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="eyebrow">Ship Detail</div>
            <h2 className="section-title mt-2">{entry.ship?.name ?? entry.shipId}</h2>
            <p className="mt-2 text-sm text-muted">
              Tier {entry.ship?.tier ?? '?'} {entry.ship?.nation ?? 'Unknown'} {entry.ship?.type ?? ''}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div
              className="rounded-full px-4 py-2 text-sm font-semibold text-white"
              style={{backgroundColor: getRatingColor(entry.rating)}}
            >
              Rating {entry.rating ?? 'N/A'}
            </div>
            <Link
              className="action-chip"
              href={buildPlayerShipsPath(snapshot.header.serverId, snapshot.header.accountId)}
            >
              Back to ships
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_360px]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {differenceMetrics.map((metric) => (
                <DifferenceTile key={metric.label} label={metric.label} value={metric.value} />
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {detailMetrics.map((metric) => (
                <div className="stat-tile" key={metric.label}>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted">{metric.label}</div>
                  <div className="mt-2 text-2xl font-semibold text-ink">{metric.value}</div>
                </div>
              ))}
            </div>
          </div>

          <aside className="soft-panel p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-muted">Expected Baseline</div>
            <div className="mt-4 grid gap-4">
              <BaselineRow
                label="Average Damage"
                value={formatNumber(entry.expected?.averageDamageDealt ?? null)}
              />
              <BaselineRow
                label="Win Rate"
                value={formatPercent(entry.expected?.winRate ?? null)}
              />
              <BaselineRow
                label="Average Frags"
                value={formatDecimal(entry.expected?.averageFrags ?? null)}
              />
            </div>
          </aside>
        </div>
      </section>
    </PlayerPageChrome>
  );
}

function DifferenceTile({label, value}: {label: string; value: string}) {
  const positive = value.startsWith('+');
  const negative = value.startsWith('-');

  return (
    <div className="stat-tile">
      <div className="text-xs uppercase tracking-[0.18em] text-muted">{label}</div>
      <div
        className="mt-2 text-2xl font-semibold"
        style={{color: positive ? '#388e3c' : negative ? '#d32f2f' : 'var(--ink)'}}
      >
        {value}
      </div>
    </div>
  );
}

function BaselineRow({label, value}: {label: string; value: string}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</div>
      <div className="mt-1 font-semibold text-ink">{value}</div>
    </div>
  );
}

function signedNumber(value: number): string {
  const rounded = Math.round(value);
  return rounded > 0 ? `+${formatNumber(rounded)}` : formatNumber(rounded);
}

function signedPercent(value: number): string {
  return value > 0 ? `+${formatPercent(value)}` : formatPercent(value);
}

function signedDecimal(value: number): string {
  return value > 0 ? `+${formatDecimal(value)}` : formatDecimal(value);
}

