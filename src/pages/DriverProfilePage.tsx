import { useEffect } from 'react';
import DriverProfile from '@/features/driver/DriverProfile';
import { DRIVER_DOCUMENT_TITLE } from '@/utils/driver';

export default function DriverProfilePage() {
  useEffect(() => {
    document.title = DRIVER_DOCUMENT_TITLE.profile;
  }, []);

  return <DriverProfile />;
}
