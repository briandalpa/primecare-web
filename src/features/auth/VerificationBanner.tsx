import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { resendVerificationEmail } from '@/services/auth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  scrolled?: boolean;
}

export default function VerificationBanner({ scrolled = false }: Props) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const emailVerified = session?.user?.emailVerified ?? false;
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);

  if (!isAuthenticated || emailVerified || dismissed) return null;

  const handleResend = async () => {
    setSending(true);
    await resendVerificationEmail(session!.user.email);
    setSending(false);
  };

  return (
    <div className="bg-warning/15 border-b border-warning/30 px-4 py-2.5">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
            <span
              className={cn(
                scrolled ? 'text-foreground/80' : 'text-primary-foreground',
              )}
            >
              Please verify your email to access all features.
            </span>
          </div>
          <div className="flex items-center gap-3 pl-6 sm:pl-0">
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-primary font-semibold"
              onClick={handleResend}
              disabled={sending}
            >
              {sending ? 'Sending…' : 'Resend'}
            </Button>
            <Link to="/auth/verify-email">
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-primary font-semibold"
              >
                Verify now
              </Button>
            </Link>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss verification banner"
          className={cn(
            scrolled
              ? 'text-muted-foreground hover:text-foreground'
              : 'text-primary-foreground/60 hover:text-primary-foreground',
          )}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
