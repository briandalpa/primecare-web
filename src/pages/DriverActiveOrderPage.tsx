import { useEffect } from 'react';
import DriverActiveOrder from '@/features/driver/DriverActiveOrder';
import { DRIVER_DOCUMENT_TITLE } from '@/utils/driver';

export default function DriverActiveOrderPage() {
  useEffect(() => {
    document.title = DRIVER_DOCUMENT_TITLE.active;
  }, []);

  return <DriverActiveOrder />;
}
