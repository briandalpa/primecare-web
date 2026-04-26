import { useEffect } from 'react';
import DriverHistory from '@/features/driver/DriverHistory';
import { DRIVER_DOCUMENT_TITLE } from '@/utils/driver';

export default function DriverHistoryPage() {
  useEffect(() => {
    document.title = DRIVER_DOCUMENT_TITLE.history;
  }, []);

  return <DriverHistory />;
}
