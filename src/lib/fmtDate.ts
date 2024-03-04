import dayjs from "dayjs";

export function formatDate(date: string) {
  return dayjs(date).format("MMM D YYYY");
}

export function formatDateTime(date: string) {
  return dayjs(date).format("MMM D YYYY, hh:mma");
}

export function formatDuration(duration: string) {
  return duration.split(":").slice(0, -1).join(":");
}

export function toIsoDate(date: Date) {
  return dayjs(date).format("YYYY-MM-DD");
}

export function nextTuesday(from: Date): Date {
  const today = dayjs(from);
  // Ensure a weekend has passed
  const nextSunday = today.day(7);
  return nextSunday.day(2).toDate();
}
