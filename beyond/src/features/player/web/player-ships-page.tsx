import {getPlayerShipsSnapshot} from '@/features/player/player-queries';
import {PlayerPageChrome} from './player-page-chrome';
import {PlayerShipsExplorer} from './player-ships-explorer';

type PlayerShipsPageProps = {
  serverId: string;
  accountId: string;
};

export async function PlayerShipsPage({
  serverId,
  accountId,
}: PlayerShipsPageProps) {
  const snapshot = await getPlayerShipsSnapshot({serverId, accountId});

  return (
    <PlayerPageChrome activeTab="ships" header={snapshot.header}>
      <PlayerShipsExplorer
        accountId={snapshot.header.accountId}
        serverId={snapshot.header.serverId}
        ships={snapshot.ships}
      />
    </PlayerPageChrome>
  );
}

