import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
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
import { AuthLayout } from '@/layouts/AuthLayout';
import { AuthLogo } from '@/features/auth/AuthLogo';
import { useSetPassword } from '@/hooks/useSetPassword';

export default function SetPasswordPage() {
  const { values, errors, isSubmitting, tokenError, handleChange, handleSubmit } =
    useSetPassword();

  if (tokenError) {
    return (
      <AuthLayout>
        <CardHeader className="text-center space-y-3">
          <AuthLogo />
          <CardTitle className="text-2xl font-heading text-destructive">
            Invalid Link
          </CardTitle>
          <CardDescription>
            This password setup link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Verification links expire after 1 hour. Please register again or
            contact support.
          </p>
          <Button asChild className="w-full" size="lg">
            <Link to="/auth/register">Back to Registration</Link>
          </Button>
        </CardContent>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <CardHeader className="text-center space-y-3">
        <AuthLogo />
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Lock className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
        </div>
        <CardTitle className="text-2xl font-heading">
          Set your password
        </CardTitle>
        <CardDescription>
          Choose a strong password for your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.password || undefined}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={values.password}
                onChange={(e) => handleChange('password', e.target.value)}
                aria-invalid={!!errors.password}
                disabled={isSubmitting}
              />
              {errors.password && <FieldError>{errors.password}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.confirmPassword || undefined}>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={values.confirmPassword}
                onChange={(e) =>
                  handleChange('confirmPassword', e.target.value)
                }
                aria-invalid={!!errors.confirmPassword}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <FieldError>{errors.confirmPassword}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            className="w-full mt-6 cursor-pointer"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Setting password...' : 'Set Password'}
          </Button>
        </form>
      </CardContent>
    </AuthLayout>
  );
}
