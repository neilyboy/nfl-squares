// Team colors mapping for NFL teams
export interface TeamColors {
  primary: string;
  secondary: string;
  tertiary?: string;
}

export const teamColors: Record<string, TeamColors> = {
  'Arizona Cardinals': { primary: '#97233F', secondary: '#000000', tertiary: '#FFFFFF' },
  'Atlanta Falcons': { primary: '#000000', secondary: '#A71930', tertiary: '#A5ACAF' },
  'Baltimore Ravens': { primary: '#241773', secondary: '#000000', tertiary: '#9E7C0C' },
  'Buffalo Bills': { primary: '#00338D', secondary: '#C60C30', tertiary: '#FFFFFF' },
  'Carolina Panthers': { primary: '#0085CA', secondary: '#000000', tertiary: '#BFC0BF' },
  'Chicago Bears': { primary: '#0B162A', secondary: '#C83803', tertiary: '#FFFFFF' },
  'Cincinnati Bengals': { primary: '#000000', secondary: '#FB4F14', tertiary: '#FFFFFF' },
  'Cleveland Browns': { primary: '#311D00', secondary: '#FF3C00', tertiary: '#FFFFFF' },
  'Dallas Cowboys': { primary: '#041E42', secondary: '#869397', tertiary: '#FFFFFF' },
  'Denver Broncos': { primary: '#FB4F14', secondary: '#002244', tertiary: '#FFFFFF' },
  'Detroit Lions': { primary: '#0076B6', secondary: '#B0B7BC', tertiary: '#FFFFFF' },
  'Green Bay Packers': { primary: '#203731', secondary: '#FFB612', tertiary: '#FFFFFF' },
  'Houston Texans': { primary: '#03202F', secondary: '#A71930', tertiary: '#FFFFFF' },
  'Indianapolis Colts': { primary: '#0056D6', secondary: '#FFFFFF' }, // Lighter royal blue for visibility
  'Jacksonville Jaguars': { primary: '#006778', secondary: '#000000', tertiary: '#9F792C' },
  'Kansas City Chiefs': { primary: '#E31837', secondary: '#FFB612', tertiary: '#FFFFFF' },
  'Las Vegas Raiders': { primary: '#000000', secondary: '#A5ACAF' },
  'Los Angeles Chargers': { primary: '#0080C6', secondary: '#FFC20E', tertiary: '#002244' },
  'Los Angeles Rams': { primary: '#002D72', secondary: '#FFCD00', tertiary: '#FFFFFF' },
  'Miami Dolphins': { primary: '#008E97', secondary: '#F26A24', tertiary: '#FFFFFF' },
  'Minnesota Vikings': { primary: '#4F2683', secondary: '#FFC62F', tertiary: '#FFFFFF' },
  'New England Patriots': { primary: '#002244', secondary: '#C60C30', tertiary: '#B0B7BC' },
  'New Orleans Saints': { primary: '#000000', secondary: '#D3BC8D', tertiary: '#FFFFFF' },
  'New York Giants': { primary: '#0B2265', secondary: '#A71930', tertiary: '#A5ACAF' },
  'New York Jets': { primary: '#125740', secondary: '#FFFFFF', tertiary: '#000000' },
  'Philadelphia Eagles': { primary: '#004C54', secondary: '#A5ACAF', tertiary: '#000000' },
  'Pittsburgh Steelers': { primary: '#000000', secondary: '#FFB612', tertiary: '#FFFFFF' },
  'San Francisco 49ers': { primary: '#AA0000', secondary: '#B3995D', tertiary: '#FFFFFF' },
  'Seattle Seahawks': { primary: '#002244', secondary: '#69BE28', tertiary: '#A5ACAF' },
  'Tampa Bay Buccaneers': { primary: '#D50A0A', secondary: '#34302B', tertiary: '#000000' },
  'Tennessee Titans': { primary: '#4B92DB', secondary: '#0C2340', tertiary: '#C8102E' },
  'Washington Commanders': { primary: '#5A1414', secondary: '#FFB612', tertiary: '#FFFFFF' },
};

export function getTeamColors(teamName: string): TeamColors {
  return teamColors[teamName] || { primary: '#1e40af', secondary: '#dc2626' };
}

export function getTeamLogo(teamName: string): string {
  const fileName = teamName.replace(/ /g, '_') + '_logo.svg';
  return `/team_logos/${fileName}`;
}

export function getTeamWordmark(teamName: string): string {
  const fileName = teamName.replace(/ /g, '_') + '_wordmark.svg';
  return `/team_wordmarks/${fileName}`;
}
