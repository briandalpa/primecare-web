import { useEffect } from 'react';
import DriverDashboard from '@/features/driver/DriverDashboard';
import { DRIVER_DOCUMENT_TITLE } from '@/utils/driver';

export default function DriverDashboardPage() {
  useEffect(() => {
    document.title = DRIVER_DOCUMENT_TITLE.dashboard;
  }, []);

  return <DriverDashboard />;
}
