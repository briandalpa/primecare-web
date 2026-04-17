import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { WORKER_COPY, WORKER_ROUTE } from '@/utils/worker';

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <div className="max-w-md space-y-4 rounded-2xl border bg-background p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-primary">403</p>
        <h1 className="text-3xl font-bold">{WORKER_COPY.forbiddenTitle}</h1>
        <p className="text-sm text-muted-foreground">{WORKER_COPY.forbiddenDescription}</p>
        <Button asChild>
          <Link to={WORKER_ROUTE.home}>{WORKER_COPY.forbiddenAction}</Link>
        </Button>
      </div>
    </main>
  );
}
