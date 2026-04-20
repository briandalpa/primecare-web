import { Link } from 'react-router-dom';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheck } from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AuthLogo } from '@/features/auth/AuthLogo';

export default function EmailVerifiedPage() {
  return (
    <AuthLayout cardClassName="text-center">
      <CardHeader className="space-y-4 items-center">
        <div className="mb-2">
          <AuthLogo />
        </div>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
          <BadgeCheck className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
        <CardTitle className="text-2xl font-heading">Email Verified!</CardTitle>
        <CardDescription>
          Your account is now fully activated. You can start scheduling pickups
          and managing your orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full cursor-pointer" size="lg">
          <Link to="/auth/login">Login</Link>
        </Button>
      </CardContent>
    </AuthLayout>
  );
}
