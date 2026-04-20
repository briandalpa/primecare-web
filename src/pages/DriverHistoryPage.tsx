import { useEffect } from 'react';
import { DriverHistoryTabs } from '@/features/driver/DriverHistoryTabs';
import { DRIVER_COPY, DRIVER_DOCUMENT_TITLE } from '@/utils/driver';

export default function DriverHistoryPage() {
  useEffect(() => {
    document.title = DRIVER_DOCUMENT_TITLE.history;
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">{DRIVER_COPY.historyTitle}</h1>
        <p className="text-sm text-muted-foreground">{DRIVER_COPY.historyDescription}</p>
      </div>
      <DriverHistoryTabs />
    </div>
  );
}
