import v1Client from "@/services/v1Client";
import v2Client from "@/services/v2Client";

import { EplEvent, EventsDayParams } from "./types/event";
import { sortEventsByStatusDescending } from "./utils/sortByDescending";

export const getEventsDay = async ({
  date,
  league = "English_Premier_League",
}: EventsDayParams): Promise<EplEvent[]> => {
  const response = await v1Client.get(`/eventsday.php?d=${date}&l=${league}`);

  if (!response.data) {
    throw new Error("No data returned from API");
  }

  if(response.status !== 200) {
    throw new Error(response.data.error);
  }

  const rawEvents = response.data.events.map((event: any) => ({
    idEvent: event.idEvent,
    strEvent: event.strEvent,
    dateEvent: event.dateEvent,
    strLeague: event.strLeague,
    strTime: event.strTime,
    strHomeTeam: event.strHomeTeam,
    strAwayTeam: event.strAwayTeam,
    strHomeTeamBadge: event.strHomeTeamBadge,
    strAwayTeamBadge: event.strAwayTeamBadge,
    strVenue: event.strVenue,
  }));

  return sortEventsByStatusDescending(rawEvents).reverse();
};
