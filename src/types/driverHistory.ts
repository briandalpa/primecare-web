import type { DeliveryHistoryItem, PickupHistoryItem } from '@/types/delivery';

export type Tab = 'all' | 'delivery' | 'pickup';

export type DisplayRow = {
  id: string;
  label: string;
  date: string;
  rawDate: string;
  customer: string;
  address: string;
  type: 'delivery' | 'pickup';
  raw: DeliveryHistoryItem | PickupHistoryItem;
};
