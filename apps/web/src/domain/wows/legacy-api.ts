export const legacyApi = {
  playerSearch:
    'https://api.worldofwarships.{0}/wows/account/list/?application_id={1}&search={2}',
  clanSearch:
    'https://api.worldofwarships.{0}/wows/clans/list/?application_id={1}&fields=clan_id%2Ctag&search={2}',
  playerInfo:
    'https://api.worldofwarships.{0}/wows/account/info/?application_id={1}&fields=account_id%2Cnickname%2Ccreated_at%2Clast_battle_time%2Cleveling_tier%2Cstatistics.pvp&account_id={2}',
  playerClan:
    'https://api.worldofwarships.{0}/wows/clans/accountinfo/?application_id={1}&extra=clan&fields=clan.tag&account_id={2}',
  playerAchievement:
    'https://api.worldofwarships.{0}/wows/account/achievements/?application_id={1}&language=en&fields=battle&account_id={2}',
  shipInfo:
    'https://api.worldofwarships.{0}/wows/ships/stats/?application_id={1}&account_id={2}',
  shipWiki:
    'https://api.worldofwarships.{0}/wows/encyclopedia/ships/?application_id={1}&fields=name%2Cnation%2Ctype%2Ctier%2Cship_id%2Cimages.small%2Cis_premium%2Cis_special&ship_id={2}',
  playerOnline:
    'https://api.worldoftanks.{0}/wgn/servers/info/?application_id={1}&fields=players_online&game=wows',
  personalRating:
    'https://raw.githubusercontent.com/HenryQuan/WoWs-Info-Origin/API/json/personal_rating.json',
} as const;

