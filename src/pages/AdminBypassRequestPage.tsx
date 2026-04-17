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
import { z } from 'zod';

type ErrorResponse = {
  message?: string;
  errors?: string;
};

const actionSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required'),
  problemDescription: z
    .string()
    .min(1, 'Problem description is required'),
});

type FieldErrors = {
  password?: string;
  problemDescription?: string;
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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const openModal = (id: string, type: ActionType) => {
    setSelectedId(id);
    setActionType(type);
    setPassword('');
    setProblemDescription('');
    setModalError(null);
    setFieldErrors({});
  };

  const closeModal = () => {
    setSelectedId(null);
    setActionType(null);
    setPassword('');
    setProblemDescription('');
    setModalError(null);
    setFieldErrors({});
  };

  const handleSubmit = async () => {
    if (!selectedId || !actionType) return;

    const parsed = actionSchema.safeParse({
      password,
      problemDescription,
    });

    if (!parsed.success) {
      const formErrors = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        password: formErrors.password?.[0],
        problemDescription:
          formErrors.problemDescription?.[0],
      });
      return;
    }

    setFieldErrors({});

    try {
      if (actionType === 'APPROVE') {
        await approveMutation.mutateAsync({
          id: selectedId,
          payload: parsed.data,
        });
        toast.success('Request approved');
      } else {
        await rejectMutation.mutateAsync({
          id: selectedId,
          payload: parsed.data,
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
        fieldErrors={fieldErrors}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onChangePassword={setPassword}
        onChangeProblem={setProblemDescription}
      />
    </div>
  );
}
