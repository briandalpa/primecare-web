import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useComplaintDetail } from '@/hooks/useComplaintDetail';
import {
  COMPLAINT_STATUS_LABEL,
  COMPLAINT_STATUS_COLOR,
  COMPLAINT_STATUS_SEQUENCE,
} from '@/utils/complaint';
import { cn } from '@/lib/utils';

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useComplaintDetail(id);
  const complaint = data?.data;

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !complaint) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Complaint not found.</p>
        <Link to="/complaints">
          <Button variant="link" className="mt-4">
            Back to Complaints
          </Button>
        </Link>
      </div>
    );
  }

  const currentIdx = COMPLAINT_STATUS_SEQUENCE.indexOf(complaint.status);

  return (
    <div className="max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/complaints')}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Complaints
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Complaint #{complaint.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-muted-foreground">
            For order{' '}
            <Link
              to={`/orders/${complaint.orderId}`}
              className="text-primary hover:underline"
            >
              #{complaint.orderId.slice(0, 8)}
            </Link>{' '}
            · Filed {format(new Date(complaint.createdAt), 'dd MMM yyyy, HH:mm')}
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn('text-xs w-fit', COMPLAINT_STATUS_COLOR[complaint.status])}
        >
          {COMPLAINT_STATUS_LABEL[complaint.status]}
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground whitespace-pre-wrap">{complaint.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Status Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {COMPLAINT_STATUS_SEQUENCE.map((s, i) => {
              const completed = i < currentIdx;
              const active = i === currentIdx;
              return (
                <div key={s} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    {completed ? (
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    ) : active ? (
                      <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/20 shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/30 shrink-0" />
                    )}
                    {i < COMPLAINT_STATUS_SEQUENCE.length - 1 && (
                      <div className={cn('w-0.5 h-6', completed ? 'bg-primary' : 'bg-border')} />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-sm pb-6',
                      active
                        ? 'font-semibold text-primary'
                        : completed
                        ? 'text-foreground'
                        : 'text-muted-foreground/50',
                    )}
                  >
                    {COMPLAINT_STATUS_LABEL[s]}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {complaint.outletName && (
        <Card>
          <CardContent className="p-4 text-sm">
            <span className="text-muted-foreground">Outlet: </span>
            <span className="text-foreground">{complaint.outletName}</span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
