import { Clock } from 'lucide-react'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { usePickupRequests } from '@/hooks/usePickupRequest'
import type { PickupStatus } from '@/types/pickupRequest'

const PICKUP_STATUS_LABEL: Record<PickupStatus, string> = {
  PENDING: 'Pending',
  DRIVER_ASSIGNED: 'Driver Assigned',
  PICKED_UP: 'Picked Up',
  CANCELLED: 'Cancelled',
}

const PICKUP_STATUS_COLOR: Record<PickupStatus, string> = {
  PENDING: 'text-yellow-600 border-yellow-300 bg-yellow-50',
  DRIVER_ASSIGNED: 'text-blue-600 border-blue-300 bg-blue-50',
  PICKED_UP: 'text-green-600 border-green-300 bg-green-50',
  CANCELLED: 'text-red-600 border-red-300 bg-red-50',
}

export default function PickupRequestList() {
  const { data, isPending } = usePickupRequests()
  const requests = data?.data ?? []

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">My Pickup Requests</h2>

      {isPending ? (
        <p className="text-center text-muted-foreground py-8">Loading...</p>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>No pickup requests yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <Card key={req.id} className="hover:shadow-md transition-shadow">
              <CardContent className="px-6 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">
                      {req.id.slice(0, 8)}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn('text-xs', PICKUP_STATUS_COLOR[req.status])}
                    >
                      {PICKUP_STATUS_LABEL[req.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{req.outletName}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Scheduled: {format(new Date(req.scheduledAt), 'dd MMM yyyy, HH:mm')}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(req.createdAt), 'dd MMM yyyy')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
