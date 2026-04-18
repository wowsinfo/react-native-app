import {PlayerShipsPage} from '@/features/player/web/player-ships-page';

type PlayerShipsRouteProps = {
  params: Promise<{
    server: string;
    accountId: string;
  }>;
};

export default async function PlayerShipsRoute({params}: PlayerShipsRouteProps) {
  const resolved = await params;

  return (
    <PlayerShipsPage
      accountId={resolved.accountId}
      serverId={resolved.server}
    />
  );
}

