import {PlayerOverviewPage} from '@/features/player/web/player-overview-page';

type PlayerOverviewRouteProps = {
  params: Promise<{
    server: string;
    accountId: string;
  }>;
};

export default async function PlayerOverviewRoute({params}: PlayerOverviewRouteProps) {
  const resolved = await params;

  return (
    <PlayerOverviewPage
      accountId={resolved.accountId}
      serverId={resolved.server}
    />
  );
}

