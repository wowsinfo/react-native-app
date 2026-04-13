export const legacyApi = {
  playerSearch:
    'https://api.worldofwarships.{0}/wows/account/list/?application_id={1}&search={2}',
  clanSearch:
    'https://api.worldofwarships.{0}/wows/clans/list/?application_id={1}&fields=clan_id%2Ctag&search={2}',
  playerOnline:
    'https://api.worldoftanks.{0}/wgn/servers/info/?application_id={1}&fields=players_online&game=wows',
} as const;

