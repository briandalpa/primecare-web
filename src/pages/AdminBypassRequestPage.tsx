import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ApproveRejectModal from '@/components/admin/ApproveRejectModal';
import BypassRequestTable from '@/features/admin/BypassRequestTable';

import {
  useAdminBypassRequests,
  useApproveBypassRequest,
  useRejectBypassRequest,
} from '@/hooks/useAdminBypassRequests';

import type { ActionType } from '@/types/bypassRequest';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

type ErrorResponse = {
  message?: string;
  errors?: string;
};

export default function AdminBypassRequestPage() {
  const { data, isLoading, isError } = useAdminBypassRequests();

  const approveMutation = useApproveBypassRequest();
  const rejectMutation = useRejectBypassRequest();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);

  const [password, setPassword] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);

  const openModal = (id: string, type: ActionType) => {
    setSelectedId(id);
    setActionType(type);
    setPassword('');
    setProblemDescription('');
    setModalError(null);
  };

  const closeModal = () => {
    setSelectedId(null);
    setActionType(null);
    setPassword('');
    setProblemDescription('');
    setModalError(null);
  };

  const handleSubmit = async () => {
    if (!selectedId || !actionType) return;

    if (!password || !problemDescription) {
      setModalError('All fields are required');
      return;
    }

    try {
      if (actionType === 'APPROVE') {
        await approveMutation.mutateAsync({
          id: selectedId,
          payload: { password, problemDescription },
        });
        toast.success('Request approved');
      } else {
        await rejectMutation.mutateAsync({
          id: selectedId,
          payload: { password, problemDescription },
        });
        toast.success('Request rejected');
      }

      closeModal();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        if (err.response?.status === 401) {
          setModalError('Incorrect password');
          return;
        }

        const errorData = err.response?.data as ErrorResponse | undefined;

        const msg =
          errorData?.message ||
          errorData?.errors ||
          'Request failed';

        setModalError(msg);
        return;
      }

      setModalError('Unexpected error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Bypass Requests" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Pending Requests
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Loading...
            </p>
          )}

          {isError && (
            <p className="text-sm text-destructive text-center py-4">
              Failed to load data
            </p>
          )}

          {!isLoading && data && (
            <BypassRequestTable
              data={data}
              onAction={openModal}
              isLoadingAction={
                approveMutation.isPending || rejectMutation.isPending
              }
            />
          )}
        </CardContent>
      </Card>

      <ApproveRejectModal
        open={!!selectedId}
        actionType={actionType}
        password={password}
        problemDescription={problemDescription}
        submitting={
          approveMutation.isPending || rejectMutation.isPending
        }
        error={modalError}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onChangePassword={setPassword}
        onChangeProblem={setProblemDescription}
      />
    </div>
  );
}