import Link from 'next/link';
import type {ReactNode} from 'react';
import {getRatingColor} from '@/domain/wows/rating';
import type {PlayerHeaderSnapshot} from '@/features/player/player-snapshot';
import {buildPlayerOverviewPath, buildPlayerShipsPath} from '@/features/router/player-routes';
import {formatNumber, formatPercent, formatUnixDate} from './player-format';

type PlayerPageChromeProps = {
  header: PlayerHeaderSnapshot;
  activeTab: 'overview' | 'ships';
  children: ReactNode;
};

export function PlayerPageChrome({
  header,
  activeTab,
  children,
}: PlayerPageChromeProps) {
  const playerName = header.clanTag ? `[${header.clanTag}] ${header.nickname}` : header.nickname;
  const overviewPath = buildPlayerOverviewPath(header.serverId, header.accountId);
  const shipsPath = buildPlayerShipsPath(header.serverId, header.accountId);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="surface-panel overflow-hidden">
        <div
          className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white sm:p-8"
          style={{
            boxShadow: `inset 0 -3px 0 ${getRatingColor(header.rating)}`,
          }}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="eyebrow text-white/70">Player Profile</div>
              <div>
                <h1 className="font-display text-4xl leading-none tracking-tight sm:text-5xl">
                  {playerName}
                </h1>
                <p className="mt-3 text-sm text-white/70">
                  {header.serverLabel} server
                  <span className="mx-2 text-white/35">|</span>
                  Account #{header.accountId}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-white/80">
                <div className="rounded-full border border-white/10 bg-white/8 px-4 py-2">
                  Tier {header.levelingTier ?? 'Unknown'}
                </div>
                <div className="rounded-full border border-white/10 bg-white/8 px-4 py-2">
                  Registered {formatUnixDate(header.createdAt)}
                </div>
                <div className="rounded-full border border-white/10 bg-white/8 px-4 py-2">
                  Last battle {formatUnixDate(header.lastBattleAt)}
                </div>
              </div>
            </div>

            <div className="grid min-w-[240px] gap-3 sm:grid-cols-2 lg:w-[320px] lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
                <div className="text-xs uppercase tracking-[0.18em] text-white/60">Rating</div>
                <div
                  className="mt-2 text-4xl font-semibold"
                  style={{color: getRatingColor(header.rating)}}
                >
                  {header.rating ?? 'N/A'}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
                <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                  Battle Summary
                </div>
                <div className="mt-2 flex items-end gap-6">
                  <div>
                    <div className="text-2xl font-semibold">
                      {formatNumber(header.pvp?.battles ?? 0)}
                    </div>
                    <div className="text-xs text-white/60">Battles</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold">
                      {formatPercent(
                        header.pvp
                          ? (header.pvp.wins / Math.max(1, header.pvp.battles)) * 100
                          : null,
                      )}
                    </div>
                    <div className="text-xs text-white/60">Win rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-line bg-white/55 px-6 py-4 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <nav className="flex flex-wrap gap-3">
              <Link className={tabClassName(activeTab === 'overview')} href={overviewPath}>
                Overview
              </Link>
              <Link className={tabClassName(activeTab === 'ships')} href={shipsPath}>
                Ships
              </Link>
              <span className="action-chip cursor-default opacity-70">Achievements soon</span>
              <span className="action-chip cursor-default opacity-70">Graph soon</span>
              <span className="action-chip cursor-default opacity-70">Rank soon</span>
            </nav>

            <div className="flex flex-wrap gap-3 text-sm">
              <Link className="action-chip" href="/search">
                Back to search
              </Link>
              <a
                className="action-chip action-chip-primary"
                href={`https://${header.serverId === 'na' ? 'na' : header.serverId}.wows-numbers.com/player/${header.accountId},${encodeURIComponent(header.nickname)}/`}
                rel="noreferrer"
                target="_blank"
              >
                Open WoWs Numbers
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-b border-line bg-white/35 px-6 py-5 sm:grid-cols-4 sm:px-8">
          <MetricTile label="Achievements" value={formatNumber(header.achievementCount)} />
          <MetricTile label="Tracked Ships" value={formatNumber(header.shipCount)} />
          <MetricTile label="Wins" value={formatNumber(header.pvp?.wins ?? 0)} />
          <MetricTile label="Damage" value={formatNumber(header.pvp?.damageDealt ?? 0)} />
        </div>
      </section>

      {children}
    </main>
  );
}

function tabClassName(active: boolean): string {
  return active ? 'action-chip action-chip-primary' : 'action-chip';
}

function MetricTile({label, value}: {label: string; value: string}) {
  return (
    <div className="stat-tile">
      <div className="text-xs uppercase tracking-[0.18em] text-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-ink">{value}</div>
    </div>
  );
}

