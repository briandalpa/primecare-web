import { useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

export function useGoogleSignIn() {
  const [isLoading, setIsLoading] = useState(false);

  async function signInWithGoogle() {
    setIsLoading(true);

    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: `${import.meta.env.VITE_CLIENT_URL}/auth/google-callback`,
      });
      // Page redirects to Google; code below does not execute in redirect mode.
    } catch {
      toast.error('Something went wrong', {
        description: 'Please try again later.',
      });
      setIsLoading(false);
    }
  }

  return { signInWithGoogle, isLoading };
}
