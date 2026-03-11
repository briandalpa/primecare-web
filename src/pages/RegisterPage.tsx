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
import { useRegister } from '@/hooks/useRegister';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import GoogleSignInButton from '@/features/auth/GoogleSignInButton';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AuthLogo } from '@/features/auth/AuthLogo';

export default function RegisterPage() {
  const { values, errors, isSubmitting, handleChange, handleSubmit } =
    useRegister();
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleSignIn();

  return (
    <AuthLayout>
      <CardHeader className="text-center space-y-3">
        <AuthLogo />
        <CardTitle className="text-2xl font-heading">
          Create your account
        </CardTitle>
        <CardDescription>
          Start getting your laundry handled effortlessly
        </CardDescription>
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
            <Field data-invalid={!!errors.name || undefined}>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                value={values.name}
                onChange={(e) => handleChange('name', e.target.value)}
                aria-invalid={!!errors.name}
                disabled={isSubmitting || isGoogleLoading}
              />
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </Field>

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
                disabled={isSubmitting || isGoogleLoading}
              />
              {errors.email && <FieldError>{errors.email}</FieldError>}
            </Field>
          </FieldGroup>

          <p className="text-xs text-muted-foreground mt-4">
            We'll send a verification link to set your password.
          </p>

          <Button
            type="submit"
            className="w-full mt-6 cursor-pointer"
            size="lg"
            disabled={isSubmitting || isGoogleLoading}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="text-primary font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </CardContent>
    </AuthLayout>
  );
}
