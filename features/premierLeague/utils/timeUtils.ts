export function addHoursToTime(time: string, hoursToAdd: number): string {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const newHours = (hours + hoursToAdd) % 24;
    return `${newHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}