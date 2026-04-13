import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  useAdminBypassRequests,
  useApproveBypassRequest,
  useRejectBypassRequest,
} from '@/hooks/useAdminBypassRequests';
import { toast } from 'sonner';
import BypassActionDialog from '@/components/BypassActionDialog';
import BypassRequestTable from '@/components/BypassRequestTable';

export default function AdminBypassRequestPage() {
  const { data, isLoading, isError, refetch } = useAdminBypassRequests();

  const approveMutation = useApproveBypassRequest();
  const rejectMutation = useRejectBypassRequest();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const handleSubmit = async (payload: {
    password: string;
    problemDescription: string;
  }) => {
    if (!selectedId || !actionType) return;

    try {
      if (actionType === 'approve') {
        await approveMutation.mutateAsync({
          id: selectedId,
          ...payload,
        });
        toast.success('Request approved');
      } else {
        await rejectMutation.mutateAsync({
          id: selectedId,
          ...payload,
        });
        toast.success('Request rejected');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.toLowerCase().includes('password')) {
          toast.error('Wrong password');
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error('Unexpected error occurred');
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Bypass Requests" />

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading && <p>Loading...</p>}

          {isError && (
            <div className="space-y-2">
              <p className="text-destructive">Failed to load data</p>
              <Button size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          )}

          {data && data.length === 0 && (
            <p className="text-muted-foreground">No pending requests</p>
          )}

          {data && data.length > 0 && (
            <BypassRequestTable
              data={data}
              onApprove={(id) => {
                setSelectedId(id);
                setActionType('approve');
              }}
              onReject={(id) => {
                setSelectedId(id);
                setActionType('reject');
              }}
              isLoading={
                approveMutation.isPending || rejectMutation.isPending
              }
            />
          )}
        </CardContent>
      </Card>

      <BypassActionDialog
        open={!!actionType}
        onClose={() => setActionType(null)}
        onSubmit={handleSubmit}
        title={
          actionType === 'approve'
            ? 'Approve Request'
            : 'Reject Request'
        }
        isLoading={
          approveMutation.isPending || rejectMutation.isPending
        }
      />
    </div>
  );
}