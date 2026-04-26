import { subDays, startOfDay, endOfDay, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { DRIVER_UI_TEXT } from '@/utils/driver';
import type { Tab } from '@/types/driverHistory';

export function HistoryHeader({
  activeTab,
  fromDate,
  toDate,
  onTabChange,
  onFilterChange,
}: {
  activeTab: Tab;
  fromDate: string;
  toDate: string;
  onTabChange: (tab: Tab) => void;
  onFilterChange: (from: string, to: string) => void;
}) {
  const setPreset = (days: number) => {
    const from = startOfDay(subDays(new Date(), days)).toISOString();
    const to = endOfDay(new Date()).toISOString();
    onFilterChange(from, to);
  };

  const fromDateObj = fromDate ? new Date(fromDate) : undefined;
  const toDateObj = toDate ? new Date(toDate) : undefined;

  const setFrom = (d: Date | undefined) =>
    onFilterChange(d ? startOfDay(d).toISOString() : '', toDate);
  const setTo = (d: Date | undefined) =>
    onFilterChange(fromDate, d ? endOfDay(d).toISOString() : '');

  return (
    <header className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-3xl font-heading font-bold text-primary md:text-2xl">
          Route History
        </h2>
        <p className="text-sm text-muted-foreground md:text-base">
          {DRIVER_UI_TEXT.historyDescription}
        </p>
      </div>
      <div className="-mx-4 flex max-w-[calc(100vw-2rem)] items-center gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        <Button
          variant={activeTab === 'all' ? 'default' : 'outline'}
          size="sm"
          className="shrink-0 rounded-full px-5"
          onClick={() => {
            onTabChange('all');
            onFilterChange('', '');
          }}
        >
          {DRIVER_UI_TEXT.historyAllTab}
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'delivery' ? 'default' : 'outline'}
          className="shrink-0 rounded-full px-5"
          onClick={() => onTabChange('delivery')}
        >
          {DRIVER_UI_TEXT.historyDeliveryTab}
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'pickup' ? 'default' : 'outline'}
          className="shrink-0 rounded-full px-5"
          onClick={() => onTabChange('pickup')}
        >
          {DRIVER_UI_TEXT.historyPickupTab}
        </Button>
        <div className="mx-1 h-5 w-px bg-border/60 shrink-0" />
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 rounded-full px-5"
          onClick={() => setPreset(7)}
        >
          Last 7 Days
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 rounded-full px-5"
          onClick={() => setPreset(30)}
        >
          Last Month
        </Button>
        <DatePickerButton
          label={DRIVER_UI_TEXT.fromDateLabel}
          value={fromDateObj}
          onChange={setFrom}
        />
        <DatePickerButton
          label={DRIVER_UI_TEXT.toDateLabel}
          value={toDateObj}
          onChange={setTo}
        />
      </div>
    </header>
  );
}

function DatePickerButton({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-2 rounded-full px-4"
        >
          <CalendarIcon className="h-4 w-4" />
          {value ? `${label}: ${format(value, 'dd MMM')}` : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar mode="single" selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  );
}
