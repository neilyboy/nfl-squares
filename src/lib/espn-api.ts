/**
 * ESPN API Integration
 * Uses unofficial ESPN endpoints to fetch NFL game data
 */

export interface ESPNGame {
  id: string;
  date: string;
  name: string;
  shortName: string;
  competitions: Array<{
    id: string;
    date: string;
    attendance: number;
    competitors: Array<{
      id: string;
      uid: string;
      type: string;
      order: number;
      homeAway: string;
      team: {
        id: string;
        uid: string;
        location: string;
        name: string;
        abbreviation: string;
        displayName: string;
        shortDisplayName: string;
        color: string;
        alternateColor: string;
        logo: string;
      };
      score: string;
      record: Array<{
        name: string;
        type: string;
        summary: string;
      }>;
    }>;
    status: {
      clock: number;
      displayClock: string;
      period: number;
      type: {
        id: string;
        name: string;
        state: string;
        completed: boolean;
        description: string;
        detail: string;
        shortDetail: string;
      };
    };
  }>;
}

export interface GameData {
  id: string;
  date: string;
  homeTeam: {
    name: string;
    abbreviation: string;
    displayName: string;
    score: number;
    logo: string;
  };
  awayTeam: {
    name: string;
    abbreviation: string;
    displayName: string;
    score: number;
    logo: string;
  };
  status: {
    period: number;
    clock: string;
    state: 'pre' | 'in' | 'post';
    completed: boolean;
    detail: string;
  };
}

/**
 * Fetches NFL scoreboard data from ESPN
 */
export async function getESPNScoreboard(
  date?: string
): Promise<ESPNGame[]> {
  const dateStr = date || getTodayDateString();
  const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${dateStr}`;
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 30 }, // Cache for 30 seconds
    });
    
    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('Error fetching ESPN scoreboard:', error);
    return [];
  }
}

/**
 * Gets a specific game by ID
 */
export async function getGameById(gameId: string): Promise<GameData | null> {
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${gameId}`;
    console.log(`Fetching game data from: ${url}`);
    
    const response = await fetch(url, {
      cache: 'no-store', // Don't cache in production
    });
    
    console.log(`ESPN API response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`ESPN data received, has header: ${!!data.header}`);
    
    const result = parseGameData(data);
    console.log(`Parse result: ${result ? 'Success' : 'Failed'}`);
    
    return result;
  } catch (error) {
    console.error(`Error fetching game ${gameId}:`, error);
    return null;
  }
}

/**
 * Gets upcoming games (next 30 days)
 */
export async function getUpcomingGames(): Promise<ESPNGame[]> {
  const games: ESPNGame[] = [];
  const today = new Date();
  
  // Fetch games for the next 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    
    const dayGames = await getESPNScoreboard(dateStr);
    games.push(...dayGames);
  }
  
  return games;
}

/**
 * Parses raw ESPN game data into our format
 */
function parseGameData(data: any): GameData | null {
  try {
    const event = data.header?.competitions?.[0];
    if (!event) {
      console.error('No event found in ESPN data');
      return null;
    }

    const competitors = event.competitors;
    if (!competitors || !Array.isArray(competitors)) {
      console.error('No competitors array found');
      return null;
    }

    const homeTeam = competitors.find((c: any) => c.homeAway === 'home');
    const awayTeam = competitors.find((c: any) => c.homeAway === 'away');

    if (!homeTeam || !awayTeam) {
      console.error('Could not find home or away team');
      return null;
    }

    return {
      id: data.header.id,
      date: event.date,
      homeTeam: {
        name: homeTeam.team.name,
        abbreviation: homeTeam.team.abbreviation,
        displayName: homeTeam.team.displayName,
        score: parseInt(homeTeam.score) || 0,
        logo: homeTeam.team.logo,
      },
      awayTeam: {
        name: awayTeam.team.name,
        abbreviation: awayTeam.team.abbreviation,
        displayName: awayTeam.team.displayName,
        score: parseInt(awayTeam.score) || 0,
        logo: awayTeam.team.logo,
      },
      status: {
        period: event.status?.period || 0,
        clock: event.status?.displayClock || '0:00',
        state: event.status?.type?.state || 'pre',
        completed: event.status?.type?.completed || false,
        detail: event.status?.type?.detail || 'Scheduled',
      },
    };
  } catch (error) {
    console.error('Error parsing game data:', error, JSON.stringify(data));
    return null;
  }
}

/**
 * Gets today's date in YYYYMMDD format
 */
function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0].replace(/-/g, '');
}

/**
 * Maps team abbreviation to logo filename
 */
export function getTeamLogoPath(teamAbbr: string): string {
  const teamMap: Record<string, string> = {
    'ARI': 'Arizona_Cardinals_logo.svg',
    'ATL': 'Atlanta_Falcons_logo.svg',
    'BAL': 'Baltimore_Ravens_logo.svg',
    'BUF': 'Buffalo_Bills_logo.svg',
    'CAR': 'Carolina_Panthers_logo.svg',
    'CHI': 'Chicago_Bears_logo.svg',
    'CIN': 'Cincinnati_Bengals_logo.svg',
    'CLE': 'Cleveland_Browns_logo.svg',
    'DAL': 'Dallas_Cowboys_logo.svg',
    'DEN': 'Denver_Broncos_logo.svg',
    'DET': 'Detroit_Lions_logo.svg',
    'GB': 'Green_Bay_Packers_logo.svg',
    'HOU': 'Houston_Texans_logo.svg',
    'IND': 'Indianapolis_Colts_logo.svg',
    'JAX': 'Jacksonville_Jaguars_logo.svg',
    'KC': 'Kansas_City_Chiefs_logo.svg',
    'LV': 'Las_Vegas_Raiders_logo.svg',
    'LAC': 'Los_Angeles_Chargers_logo.svg',
    'LAR': 'Los_Angeles_Rams_logo.svg',
    'MIA': 'Miami_Dolphins_logo.svg',
    'MIN': 'Minnesota_Vikings_logo.svg',
    'NE': 'New_England_Patriots_logo.svg',
    'NO': 'New_Orleans_Saints_logo.svg',
    'NYG': 'New_York_Giants_logo.svg',
    'NYJ': 'New_York_Jets_logo.svg',
    'PHI': 'Philadelphia_Eagles_logo.svg',
    'PIT': 'Pittsburgh_Steelers_logo.svg',
    'SF': 'San_Francisco_49ers_logo.svg',
    'SEA': 'Seattle_Seahawks_logo.svg',
    'TB': 'Tampa_Bay_Buccaneers_logo.svg',
    'TEN': 'Tennessee_Titans_logo.svg',
    'WAS': 'Washington_Commanders_logo.svg',
  };
  
  return teamMap[teamAbbr] || 'default_logo.svg';
}

/**
 * Maps team abbreviation to wordmark filename
 */
export function getTeamWordmarkPath(teamAbbr: string): string {
  return getTeamLogoPath(teamAbbr).replace('_logo.svg', '_wordmark.svg');
}
