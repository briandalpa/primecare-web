import { Link } from 'react-router-dom';
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
import { Separator } from '@/components/ui/separator';
import { useCustomerLogin } from '@/hooks/useCustomerLogin';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import GoogleSignInButton from '@/features/auth/GoogleSignInButton';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AuthLogo } from '@/features/auth/AuthLogo';

export default function CustomerLoginPage() {
  const { values, errors, isSubmitting, handleChange, handleSubmit } =
    useCustomerLogin();
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleSignIn();

  return (
    <AuthLayout>
      <CardHeader className="text-center space-y-3">
        <AuthLogo />
        <CardTitle className="text-2xl font-heading">Welcome back</CardTitle>
        <CardDescription>Log in to manage your laundry orders</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <GoogleSignInButton
          onClick={signInWithGoogle}
          isLoading={isGoogleLoading}
          disabled={isSubmitting}
        />

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground uppercase">or</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.email || undefined}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                aria-invalid={!!errors.email}
              />
              {errors.email && <FieldError>{errors.email}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.password || undefined}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
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
            disabled={isSubmitting || isGoogleLoading}
          >
            {isSubmitting ? 'Logging in…' : 'Login'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link
            to="/auth/register"
            className="text-primary font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </CardContent>
    </AuthLayout>
  );
}
