import { CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TIME_SLOTS } from '@/utils/pickupSlots'

type Props = {
  date?: Date
  setDate: (d: Date | undefined) => void
  timeSlot: string
  setTimeSlot: (v: string) => void
}

export default function PickupScheduleSelector({ date, setDate, timeSlot, setTimeSlot }: Props) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="mb-8">
      <Label className="text-base font-semibold flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-primary" /> Preferred Pickup Time
      </Label>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-muted-foreground mb-1.5 block">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'd MMMM yyyy') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < today}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label className="text-sm text-muted-foreground mb-1.5 block">Time Slot</Label>
          <Select value={timeSlot} onValueChange={setTimeSlot}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a time slot" />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((slot) => (
                <SelectItem key={slot.value} value={slot.value}>
                  {slot.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
