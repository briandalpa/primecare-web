export const SHIFT_TIME_OPTIONS = [
  { value: '00:00', label: 'Night Shift (00:00 - 08:00)' },
  { value: '08:00', label: 'Morning Shift (08:00 - 16:00)' },
  { value: '16:00', label: 'Evening Shift (16:00 - 00:00)' },
] as const;

export type ShiftStartTime = (typeof SHIFT_TIME_OPTIONS)[number]['value'];

export const getDefaultShiftDate = () => {
  const date = new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

export const getCurrentShiftStartTime = (): ShiftStartTime => {
  const hour = new Date().getHours();
  if (hour < 8) return '00:00';
  if (hour < 16) return '08:00';
  return '16:00';
};

export const createShiftStartedAt = (date: string, time: string) => {
  return new Date(`${date}T${time}:00`).toISOString();
};
