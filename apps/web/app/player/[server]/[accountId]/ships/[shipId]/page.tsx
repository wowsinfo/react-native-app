import {PlayerShipDetailPage} from '@/features/player/web/player-ship-detail-page';

type PlayerShipDetailRouteProps = {
  params: Promise<{
    server: string;
    accountId: string;
    shipId: string;
  }>;
};

export default async function PlayerShipDetailRoute({
  params,
}: PlayerShipDetailRouteProps) {
  const resolved = await params;

  return (
    <PlayerShipDetailPage
      accountId={resolved.accountId}
      serverId={resolved.server}
      shipId={resolved.shipId}
    />
  );
}

