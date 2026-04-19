import { Navigate, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OutletForm } from '@/features/admin/outlets/OutletForm';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAdminOutlet } from '@/hooks/useAdminOutlet';
import { useCreateAdminOutlet } from '@/hooks/useCreateAdminOutlet';
import { useUpdateAdminOutlet } from '@/hooks/useUpdateAdminOutlet';
import type { OutletFormSchemaValues } from '@/features/admin/outlets/outletFormSchema';

export default function AdminOutletFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { effectiveRole } = useCurrentUser();
  const isEditMode = !!id;
  const { data, isPending: loadingOutlet } = useAdminOutlet(id);
  const createMutation = useCreateAdminOutlet(() => navigate('/admin/outlets'));
  const updateMutation = useUpdateAdminOutlet(() => navigate('/admin/outlets'));

  if (effectiveRole !== 'SUPER_ADMIN') {
    return <Navigate to="/forbidden" replace />;
  }

  if (isEditMode && loadingOutlet) {
    return <p className="py-8 text-center text-muted-foreground">Loading outlet...</p>;
  }

  const handleSubmit = (values: OutletFormSchemaValues) => {
    if (isEditMode && id) {
      updateMutation.mutate({ outletId: id, payload: values });
      return;
    }

    createMutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <PageHeader title={isEditMode ? 'Edit Outlet' : 'Create Outlet'} />

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Update Outlet Details' : 'New Outlet Details'}</CardTitle>
        </CardHeader>
        <CardContent>
          <OutletForm
            initialValues={data?.data}
            isPending={createMutation.isPending || updateMutation.isPending}
            submitLabel={isEditMode ? 'Save Changes' : 'Create Outlet'}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
