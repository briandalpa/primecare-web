import { useState } from 'react';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import BypassActionDialog from '@/components/BypassActionDialog';
import BypassRequestTable from '@/components/BypassRequestTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useAdminBypassRequests,
  useApproveBypassRequest,
  useRejectBypassRequest,
} from '@/hooks/useAdminBypassRequests';

export default function AdminBypassRequestPage() {
  const { data, error, isError, isLoading, refetch } = useAdminBypassRequests();
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

      setActionType(null);
      setSelectedId(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.toLowerCase().includes('password')) {
          toast.error('Wrong password');
        } else {
          toast.error(error.message);
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
          {isLoading && (
            <p className="text-center text-sm text-muted-foreground">
              Loading...
            </p>
          )}

          {isError && (
            <div className="space-y-2 text-center">
              <p className="text-sm text-destructive">
                {error?.message || 'Failed to load data'}
              </p>
              <Button size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          )}

          {!isLoading && data?.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No pending bypass requests
            </div>
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
        title={actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
        isLoading={approveMutation.isPending || rejectMutation.isPending}
      />
    </div>
  );
}
