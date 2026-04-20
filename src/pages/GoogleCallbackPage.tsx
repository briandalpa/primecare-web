import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AuthLogo } from '@/features/auth/AuthLogo';
import { useSession } from '@/lib/auth-client';
import { getMyProfile } from '@/services/user';
import { getDashboardRoute } from '@/utils/auth';

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();
  const didRedirect = useRef(false);

  useEffect(() => {
    if (isPending || didRedirect.current) return;

    if (!session?.user) {
      toast.error('Sign-in failed', { description: 'Please try again.' });
      navigate('/auth/login', { replace: true });
      return;
    }

    if (!session.user.emailVerified) {
      navigate('/', { replace: true });
      return;
    }

    didRedirect.current = true;

    getMyProfile()
      .then((profile) => {
        const role = profile?.staff?.role ?? 'CUSTOMER';
        toast.success('Welcome!', { description: `Signed in as ${profile.name}` });
        navigate(getDashboardRoute(role), { replace: true });
      })
      .catch(() => {
        toast.error('Failed to load profile', { description: 'Please try again.' });
        navigate('/auth/login', { replace: true });
      });
  }, [isPending, session, navigate]);

  return (
    <AuthLayout>
      <CardHeader className="text-center space-y-3">
        <AuthLogo />
        <CardTitle className="text-2xl font-heading">Signing you in…</CardTitle>
        <CardDescription>
          Please wait while we set up your session.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-4">
        <Loader2
          className="h-8 w-8 animate-spin text-primary"
          aria-label="Loading"
        />
      </CardContent>
    </AuthLayout>
  );
}
