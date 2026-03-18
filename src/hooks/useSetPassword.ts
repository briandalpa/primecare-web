import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { setPassword } from '@/services/auth';
import {
  setPasswordSchema,
  type SetPasswordFormValues,
  type SetPasswordFormErrors,
} from '@/features/auth/setPasswordSchema';

export function useSetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [values, setValues] = useState<SetPasswordFormValues>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<SetPasswordFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    if (!token) setTokenError(true);
  }, [token]);

  function handleChange(field: keyof SetPasswordFormValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setTokenError(true);
      return;
    }

    const result = setPasswordSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: SetPasswordFormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof SetPasswordFormValues;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await setPassword({ token, password: result.data.password });
      toast.success('Password set successfully!', {
        description: 'You can now login with your new password.',
      });
      navigate('/auth/email-verified', { replace: true });
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 400 || status === 404) {
          setTokenError(true);
          toast.error('Invalid or expired link', {
            description: 'Please request a new verification email.',
          });
        } else {
          toast.error('Failed to set password', {
            description: message || 'Please try again.',
          });
        }
      } else {
        toast.error('Something went wrong', {
          description: 'Please check your connection and try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return { values, errors, isSubmitting, tokenError, handleChange, handleSubmit };
}
