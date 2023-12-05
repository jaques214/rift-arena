export const RANK_LIST: string[] = [
    'IRON',
    'BRONZE',
    'SILVER',
    'GOLD',
    'PLATINUM',
    'DIAMOND',
    'GRANDMASTER',
    'MASTER',
    'CHALLENGER',
  ];

export function getRankIcon(key: any) {
  let rank: string;
  switch (key) {
    case 'IRON':
      rank = './assets/images/ranked-emblems/Emblem_Iron.png';
      break;
    case 'BRONZE':
      rank = './assets/images/ranked-emblems/Emblem_Bronze.png';
      break;
    case 'SILVER':
      rank = './assets/images/ranked-emblems/Emblem_Silver.png';
      break;
    case 'GOLD':
      rank = './assets/images/ranked-emblems/Emblem_Gold.png';
      break;
    case 'PLATINUM':
      rank = './assets/images/ranked-emblems/Emblem_Platinum.png';
      break;
    case 'DIAMOND':
      rank = './assets/images/ranked-emblems/Emblem_Diamond.png';
      break;
    case 'GRANDMASTER':
      rank = './assets/images/ranked-emblems/Emblem_Grandmaster.png';
      break;
    case 'MASTER':
      rank = './assets/images/ranked-emblems/Emblem_Master.png';
      break;
    case 'CHALLENGER':
      rank = './assets/images/ranked-emblems/Emblem_Challenger.png';
      break;
    default:
      rank = './assets/images/ranked-emblems/Emblem_Bronze.png';
      break;
  }
  return rank;
}
