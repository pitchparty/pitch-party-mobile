import { EplEvent } from "../types/event";

export const getMatchStatus = (dateEvent: string, strTime: string): "Not Started" | "Live" | "Finished" => {
    const matchStart = new Date(`${dateEvent}T${strTime}Z`);
    const matchEnd = new Date(matchStart.getTime() + 2 * 60 * 60 * 1000); // assume 2 hours per match
    const now = new Date();
  
    if (now < matchStart) return "Not Started";
    if (now >= matchStart && now <= matchEnd) return "Live";
    return "Finished";
  };
  
export const sortEventsByStatusDescending = (events: EplEvent[]): EplEvent[] => {
    const getStatusOrder = (status: "Live" | "Not Started" | "Finished") => {
      switch (status) {
        case "Live":
          return 0;
        case "Not Started":
          return 1;
        case "Finished":
          return 2;
        default:
          return 3;
      }
    };
  
    return [...events].sort((a, b) => {
      const statusA = getMatchStatus(a.dateEvent, a.strTime);
      const statusB = getMatchStatus(b.dateEvent, b.strTime);
  
      const statusOrderA = getStatusOrder(statusA);
      const statusOrderB = getStatusOrder(statusB);
  
      if (statusOrderA !== statusOrderB) {
        return statusOrderA - statusOrderB; // Lower value = higher priority
      }
  
      // If same status, sort by start time DESCENDING (latest first)
      const dateA = new Date(`${a.dateEvent}T${a.strTime}Z`);
      const dateB = new Date(`${b.dateEvent}T${b.strTime}Z`);
  
      return dateB.getTime() - dateA.getTime(); // Descending
    });
  };
  