import { useEffect, useState } from 'react';
import {
  getAdminBypassRequests,
  approveBypassRequest,
  rejectBypassRequest,
} from '@/services/adminBypassRequest';
import type { BypassRequest } from '@/types/bypassRequest';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminBypassRequestPage() {
  const [data, setData] = useState<BypassRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAdminBypassRequests();

        const pending = res.filter(
          (item: BypassRequest) => item.status === 'PENDING'
        );

        setData(pending);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unexpected error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    const password = prompt('Enter admin password');
    const problemDescription = prompt('Enter problem description');

    if (!password || !problemDescription) return;

    try {
      await approveBypassRequest(id, { password, problemDescription });

      setData((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert('Failed to approve');
    }
  };

  const handleReject = async (id: string) => {
    const password = prompt('Enter admin password');
    const problemDescription = prompt('Enter problem description');

    if (!password || !problemDescription) return;

    try {
      await rejectBypassRequest(id, { password, problemDescription });

      setData((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert('Failed to reject');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Bypass Requests" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending Requests</CardTitle>
        </CardHeader>

        <CardContent>
          {loading && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Loading...
            </p>
          )}

          {error && (
            <p className="text-sm text-destructive text-center py-4">
              {error}
            </p>
          )}

          {!loading && data.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No pending bypass requests
            </p>
          )}

          {!loading && data.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-muted-foreground">ID</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground">Problem</th>
                    <th className="pb-3 font-medium text-muted-foreground">Created At</th>
                    <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b last:border-0 hover:bg-muted/40"
                    >
                      <td className="py-3 font-mono text-xs text-muted-foreground">
                        {item.id}
                      </td>

                      <td className="py-3">{item.status}</td>

                      <td className="py-3">
                        {item.problemDescription ?? '\u2014'}
                      </td>

                      <td className="py-3 text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>

                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(item.id)}
                          >
                            Approve
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(item.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}