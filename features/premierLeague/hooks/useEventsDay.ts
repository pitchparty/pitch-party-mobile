import { useQuery } from '@tanstack/react-query';

import { getEventsDay } from '../api';
import { EplEvent } from '../types/event';
import { getWeekendDate } from '../utils/dateUtils';

export const useEventsDay = () => {
  const weekend = getWeekendDate();
  const params = {
    date: weekend,
    league: "English_Premier_League",
  }
  return useQuery<EplEvent[]>({
    queryKey: ['eventsDay', weekend, params.league],
    // queryFn: () => events,
    queryFn: () => getEventsDay(params),
    staleTime: 1000 * 60 * 5, // 5 minutes caching
  });
};
