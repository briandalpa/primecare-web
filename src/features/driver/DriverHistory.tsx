import { useState } from 'react';
import { formatDriverDateTime, DRIVER_HISTORY_DEFAULT_FILTERS } from '@/utils/driver';
import { useDeliveryHistory } from '@/hooks/useDeliveryHistory';
import { usePickupHistory } from '@/hooks/usePickupHistory';
import type { DeliveryHistoryItem, PickupHistoryItem } from '@/types/delivery';
import type { Tab, DisplayRow } from '@/types/driverHistory';
import { HistoryHeader } from './DriverHistoryHeader';
import { HistoryBody, HistoryPagination } from './DriverHistoryContent';
import { DeliveryDetailDialog, PickupDetailDialog } from './DriverHistoryDialogs';

const PAGE_SIZE = DRIVER_HISTORY_DEFAULT_FILTERS.limit;

function toRow(
  item: DeliveryHistoryItem | PickupHistoryItem,
  tab: 'delivery' | 'pickup',
): DisplayRow {
  if (tab === 'delivery') {
    const d = item as DeliveryHistoryItem;
    return {
      id: d.id,
      label: `Delivery #${d.id.slice(-6).toUpperCase()}`,
      date: d.deliveredAt ? formatDriverDateTime(d.deliveredAt) : '—',
      rawDate: d.deliveredAt ?? d.createdAt,
      customer: d.customer.name ?? '—',
      address: `${d.deliveryAddress.street}, ${d.deliveryAddress.city}`,
      type: 'delivery',
      raw: d,
    };
  }
  const p = item as PickupHistoryItem;
  return {
    id: p.id,
    label: `Pickup #${p.id.slice(-6).toUpperCase()}`,
    date: formatDriverDateTime(p.completedAt),
    rawDate: p.completedAt,
    customer: p.customerName ?? '—',
    address: `${p.pickupAddress.street}, ${p.pickupAddress.city}`,
    type: 'pickup',
    raw: p,
  };
}

export default function DriverHistory() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
  const [selectedPickup, setSelectedPickup] = useState<PickupHistoryItem | null>(null);

  const deliveryQuery = useDeliveryHistory({ page, limit: PAGE_SIZE, fromDate, toDate });
  const pickupQuery = usePickupHistory({ page, limit: PAGE_SIZE, fromDate, toDate });

  const deliveryRows = (deliveryQuery.data?.data ?? []).map((item) => toRow(item, 'delivery'));
  const pickupRows = (pickupQuery.data?.data ?? []).map((item) => toRow(item, 'pickup'));

  const rows =
    activeTab === 'all'
      ? [...deliveryRows, ...pickupRows].sort(
          (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime(),
        )
      : activeTab === 'delivery'
      ? deliveryRows
      : pickupRows;

  const isLoading =
    activeTab === 'all'
      ? deliveryQuery.isLoading || pickupQuery.isLoading
      : activeTab === 'delivery'
      ? deliveryQuery.isLoading
      : pickupQuery.isLoading;

  const isError =
    activeTab === 'all'
      ? deliveryQuery.isError && pickupQuery.isError
      : activeTab === 'delivery'
      ? deliveryQuery.isError
      : pickupQuery.isError;

  const totalPages =
    activeTab === 'all'
      ? 1
      : (activeTab === 'delivery' ? deliveryQuery : pickupQuery).data?.meta.totalPages ?? 1;

  const applyFilter = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    setPage(1);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleRowSelect = (row: DisplayRow) => {
    if (row.type === 'delivery') setSelectedDeliveryId(row.id);
    else setSelectedPickup(row.raw as PickupHistoryItem);
  };

  return (
    <div className="space-y-5 md:space-y-8">
      <HistoryHeader
        activeTab={activeTab}
        fromDate={fromDate}
        toDate={toDate}
        onTabChange={handleTabChange}
        onFilterChange={applyFilter}
      />
      <HistoryBody
        rows={rows}
        isLoading={isLoading}
        isError={isError}
        onSelect={handleRowSelect}
      />
      {totalPages > 1 && (
        <HistoryPagination
          current={page}
          total={totalPages}
          onPageChange={setPage}
        />
      )}
      <DeliveryDetailDialog
        deliveryId={selectedDeliveryId}
        onClose={() => setSelectedDeliveryId(null)}
      />
      <PickupDetailDialog
        pickup={selectedPickup}
        onClose={() => setSelectedPickup(null)}
      />
    </div>
  );
}
