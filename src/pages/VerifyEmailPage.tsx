import { useState, useEffect } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { resendVerificationEmail } from '@/services/auth';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AuthLogo } from '@/features/auth/AuthLogo';

export default function VerifyEmailPage() {
  const location = useLocation();
  const email = location.state?.email as string | undefined;
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleResend() {
    if (!email || cooldown > 0) return;

    setIsResending(true);
    try {
      await resendVerificationEmail(email);
      toast.success('Email sent!', {
        description: 'Check your inbox for the verification link.',
      });
      setCooldown(60);
    } catch {
      toast.error('Failed to send email', {
        description: 'Please try again later.',
      });
    } finally {
      setIsResending(false);
    }
  }

  return (
    <AuthLayout>
      <CardHeader className="text-center space-y-4 items-center">
        <AuthLogo />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
        <CardTitle className="text-2xl font-heading">Check your email</CardTitle>
        <CardDescription>
          {email ? (
            <>
              We sent a password setup link to{' '}
              <span className="font-semibold text-foreground">{email}</span>
            </>
          ) : (
            'We sent you a password setup link'
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {email && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
          >
            {cooldown > 0 ? (
              `Resend in ${cooldown}s`
            ) : isResending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Resend verification email'
            )}
          </Button>
        )}
      </CardContent>
    </AuthLayout>
  );
}
