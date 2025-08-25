import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { SportEvent } from '../types';

// This function would actually call TheSportsDB API in a real implementation
const fetchUpcomingSportEvents = async (): Promise<SportEvent[]> => {
  // Example API call (not functional without your actual API key)
  // const response = await fetch(`https://www.thesportsdb.com/api/v1/json/YOUR_API_KEY/eventsday.php?d=${format(new Date(), 'yyyy-MM-dd')}`);
  // if (!response.ok) throw new Error('Failed to fetch events');
  // const data = await response.json();
  // return data.events || [];
  
  // Mock data for demonstration
  return [
    {
      idEvent: 'e3',
      strEvent: 'Arsenal vs Chelsea',
      strTimestamp: '2025-05-18T15:00:00',
      strLeague: 'Premier League',
      strHomeTeam: 'Arsenal',
      strAwayTeam: 'Chelsea',
      strThumb: 'https://example.com/arsenal-chelsea.jpg'
    },
    {
      idEvent: 'e4',
      strEvent: 'Barcelona vs Real Madrid',
      strTimestamp: '2025-05-20T19:00:00',
      strLeague: 'La Liga',
      strHomeTeam: 'Barcelona',
      strAwayTeam: 'Real Madrid',
      strThumb: 'https://example.com/barca-madrid.jpg'
    },
    {
      idEvent: 'e5',
      strEvent: 'Warriors vs Suns',
      strTimestamp: '2025-05-17T22:00:00',
      strLeague: 'NBA',
      strHomeTeam: 'Warriors',
      strAwayTeam: 'Suns',
      strThumb: 'https://example.com/warriors-suns.jpg'
    }
  ];
};

export const useSportEvents = () => {
  return useQuery({
    queryKey: ['sportEvents'],
    queryFn: fetchUpcomingSportEvents,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};