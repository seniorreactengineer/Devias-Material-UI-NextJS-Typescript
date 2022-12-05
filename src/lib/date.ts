import { subDays, subHours } from "date-fns";

export const getMonthDay = (dateStr) =>
  subDays(subHours(new Date(dateStr), 4), 1).getTime();
