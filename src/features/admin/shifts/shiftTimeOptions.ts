export const SHIFT_TIME_OPTIONS = [
  { value: '07:00', label: 'Shift 1 (07.00 - 15.00)' },
  { value: '13:00', label: 'Shift 2 (13.00 - 21.00)' },
  { value: '15:00', label: 'Shift 3 (15.00 - 23.00)' },
] as const;

export type ShiftStartTime = (typeof SHIFT_TIME_OPTIONS)[number]['value'];

export const getDefaultShiftDate = () => {
  const date = new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

export const getCurrentShiftStartTime = (): ShiftStartTime => {
  const hour = new Date().getHours();
  if (hour < 13) return '07:00';
  if (hour < 15) return '13:00';
  return '15:00';
};

export const createShiftStartedAt = (date: string, time: string) => {
  return new Date(`${date}T${time}:00`).toISOString();
};
