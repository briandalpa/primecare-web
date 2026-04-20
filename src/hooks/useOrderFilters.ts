import { useState } from 'react';
import type { AdminOrderParams } from '@/types/order';

export function useOrderFilters() {
  const [page, setPageState] = useState(1);
  const [search, setSearchState] = useState('');
  const [status, setStatusState] = useState('ALL');
  const [outletId, setOutletIdState] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const setPage = (p: number) => setPageState(p);

  // Reset to page 1 whenever a filter changes — server-side pagination means
  // the current page may not exist under the new filter set.
  const setSearch = (v: string) => {
    setSearchState(v);
    setPageState(1);
  };

  const setStatus = (v: string) => {
    setStatusState(v);
    setPageState(1);
  };

  const setOutletId = (v: string) => {
    setOutletIdState(v);
    setPageState(1);
  };

  // Sort value is encoded as "<field>-<direction>" (e.g. "createdAt-desc") to fit a single select input.
  const setSortValue = (combined: string) => {
    const [s, o] = combined.split('-');
    setSortBy(s);
    setOrder(o);
    setPageState(1);
  };

  const sortValue = `${sortBy}-${order}`;

  const params: AdminOrderParams = {
    page,
    limit: 10,
    search: search || undefined,
    status: status !== 'ALL' ? status : undefined,  // 'ALL' is a UI-only sentinel; omit the param so the backend returns every status.
    outletId: outletId || undefined,
    sortBy,
    order,
  };

  const filters = { search, status, outletId, sortValue };

  return {
    page,
    filters,
    params,
    setPage,
    setSearch,
    setStatus,
    setOutletId,
    setSortValue,
  };
}
