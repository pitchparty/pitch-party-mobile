export interface EventsDayParams {
    date: string;
    league?: string;
  }
  
  export interface EplEvent {
    idEvent: string;
    strEvent: string;
    dateEvent: string;
    strLeague: string;
    strTime: string;
    strHomeTeam: string;
    strAwayTeam: string;
    strHomeTeamBadge: string;
    strAwayTeamBadge: string;
    strVenue: string;
  }
  