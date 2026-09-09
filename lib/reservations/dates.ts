export function reservationDates(category: string, startDate: string, endDate: string, time: string) {
  function parse(date: string, clock: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(clock)) return null;
    const value = new Date(`${date}T${clock}:00`);
    if (!Number.isFinite(value.getTime())) return null;
    // Date normalizes impossible dates such as February 30 instead of rejecting them.
    const [year, month, day] = date.split("-").map(Number);
    return value.getFullYear() === year && value.getMonth() + 1 === month && value.getDate() === day ? value : null;
  }
  const startsAt = parse(startDate, category === "food" ? time : "15:00");
  const endsAt = endDate ? parse(endDate, category === "transport" ? "10:00" : "11:00") : null;
  if (!startsAt || (endDate && !endsAt) || (category !== "food" && !endsAt) || (endsAt && endsAt <= startsAt)) return null;
  return { startsAt, endsAt };
}
