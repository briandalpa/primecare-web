import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminLogin } from '@/hooks/useAdminLogin';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AuthLogo } from '@/features/auth/AuthLogo';

export default function AdminLoginPage() {
  const { values, errors, isSubmitting, handleChange, handleSubmit } =
    useAdminLogin();

  return (
    <AuthLayout cardClassName="border-secondary">
      <CardHeader className="text-center space-y-3">
        <AuthLogo />
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-xs font-medium uppercase tracking-wider">
            Admin Portal
          </span>
        </div>
        <CardTitle className="text-2xl font-heading">Admin Login</CardTitle>
        <CardDescription>Access the management dashboard</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.email || undefined}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                autoComplete="email"
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                aria-invalid={!!errors.email}
              />
              {errors.email && <FieldError>{errors.email}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.password || undefined}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={values.password}
                onChange={(e) => handleChange('password', e.target.value)}
                aria-invalid={!!errors.password}
              />
              {errors.password && <FieldError>{errors.password}</FieldError>}
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            className="w-full mt-6 cursor-pointer"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in…' : 'Login'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Not an admin?{' '}
          <Link
            to="/auth/login"
            className="text-primary font-semibold hover:underline"
          >
            Customer Login
          </Link>
        </p>
      </CardContent>
    </AuthLayout>
  );
}
